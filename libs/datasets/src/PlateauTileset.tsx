import {
  BoundingSphere,
  Cartographic,
  Cesium3DTileFeature,
  Cesium3DTileset,
  Math as CesiumMath,
  ShadowMode,
  type Cesium3DTile,
  type Cesium3DTileStyle
} from '@cesium/engine'
import { useAtomValue } from 'jotai'
import { forwardRef, useEffect, useRef } from 'react'

import { useAsyncInstance, useCesium } from '@takram/plateau-cesium'
import { forEachTileFeature } from '@takram/plateau-cesium-helpers'
import {
  assignForwardedRef,
  useConstant,
  withDeferredProps,
  withEphemerality
} from '@takram/plateau-react-helpers'
import {
  screenSpaceSelectionAtom,
  useScreenSpaceSelectionResponder,
  type ScreenSpaceSelectionEntry
} from '@takram/plateau-screen-space-selection'

import { LambertDiffuseShader } from './LambertDiffuseShader'
import { PlateauGMLIndex, getGmlId } from './PlateauGMLIndex'
import {
  showTilesetBoundingVolumeAtom,
  showTilesetWireframeAtom
} from './states'
import { type TilesetPrimitiveConstructorOptions } from './types'

export const PLATEAU_TILESET = 'PLATEAU_TILESET'

declare module '@takram/plateau-screen-space-selection' {
  interface ScreenSpaceSelectionOverrides {
    [PLATEAU_TILESET]: {
      key: string
      gmlIndex: PlateauGMLIndex
    }
  }
}

const cartographicScratch = new Cartographic()

interface PlateauTilesetContentProps
  extends TilesetPrimitiveConstructorOptions {
  url: string
  style?: Cesium3DTileStyle
  disableShadow?: boolean
  showWireframe?: boolean
  showBoundingVolume?: boolean
}

const PlateauTilesetContent = withEphemerality(
  () => useCesium(({ scene }) => scene).primitives,
  ['url'],
  forwardRef<Cesium3DTileset, PlateauTilesetContentProps>(
    (
      {
        url,
        style,
        disableShadow = false,
        showWireframe = false,
        showBoundingVolume = false,
        ...props
      },
      forwardedRef
    ) => {
      // Assume that component is ephemeral.
      const gmlIndex = useConstant(() => new PlateauGMLIndex())

      const selection = useAtomValue(screenSpaceSelectionAtom)
      const selectionRef = useRef(selection)
      selectionRef.current = selection

      const scene = useCesium(({ scene }) => scene)
      const tileset = useAsyncInstance({
        owner: scene.primitives,
        keys: [url, scene],
        create: async () =>
          await Cesium3DTileset.fromUrl(url, {
            // @ts-expect-error missing type
            customShader: LambertDiffuseShader,
            shadows:
              disableShadow || showWireframe
                ? ShadowMode.DISABLED
                : ShadowMode.ENABLED,
            debugWireframe: showWireframe,
            debugShowBoundingVolume: showBoundingVolume
          }),
        transferOwnership: (tileset, primitives) => {
          const removeListeners = [
            tileset.tileLoad.addEventListener((tile: Cesium3DTile) => {
              gmlIndex.addTile(tile)

              // Mark features as selected when tiles are loaded.
              forEachTileFeature(tile, feature => {
                const id = getGmlId(feature)
                const selected = selectionRef.current.some(
                  ({ type, value }) =>
                    type === PLATEAU_TILESET && value.key === id
                )
                if (selected) {
                  feature.setProperty('selected', true)
                }
              })
            })
          ]
          // TODO: Make sure it's not necessary to observe tileUnload events.
          primitives.add(tileset)
          return () => {
            // No need to clean up gmlIndex because component is ephemeral.
            removeListeners.forEach(removeListener => {
              removeListener()
            })
            primitives.remove(tileset)
          }
        }
      })

      if (tileset != null) {
        tileset.shadows =
          disableShadow || showWireframe
            ? ShadowMode.DISABLED
            : ShadowMode.ENABLED
        tileset.debugWireframe = showWireframe
        tileset.debugShowBoundingVolume = showBoundingVolume
        Object.assign(tileset, props)
      }

      // Assignment of style is not trivial.
      useEffect(() => {
        if (tileset != null) {
          tileset.style = style
        }
      }, [style, tileset])

      useEffect(() => {
        assignForwardedRef(forwardedRef, tileset ?? null)
      }, [forwardedRef, tileset])

      useScreenSpaceSelectionResponder({
        type: PLATEAU_TILESET,
        transform: object => {
          if (
            !(object instanceof Cesium3DTileFeature) ||
            object.tileset !== tileset
          ) {
            return
          }
          const id = getGmlId(object)
          return id != null
            ? {
                type: PLATEAU_TILESET,
                value: {
                  key: id,
                  gmlIndex
                }
              }
            : undefined
        },
        predicate: (
          value
        ): value is ScreenSpaceSelectionEntry<typeof PLATEAU_TILESET> => {
          return value.type === PLATEAU_TILESET && gmlIndex.has(value.value.key)
        },
        onSelect: value => {
          const features = gmlIndex.find(value.value.key)
          if (features == null) {
            return
          }
          features.forEach(feature => {
            feature.setProperty('selected', true)
          })
        },
        onDeselect: value => {
          const features = gmlIndex.find(value.value.key)
          if (features == null) {
            return
          }
          features.forEach(feature => {
            feature.setProperty('selected', false)
          })
        },
        computeBoundingSphere: (value, result = new BoundingSphere()) => {
          const features = gmlIndex.find(value.value.key)
          if (features == null) {
            return
          }
          // TODO: Do I have to the bounding sphere of all the features?
          const [feature] = features

          // I cannot find the way to access glTF buffer. Try approximate bounding
          // sphere by property values, but PLATEAU 2022 tilesets don't have
          // coordinates information in their properties. Only PLATEAU 2020
          // datasets are supported.
          const x: number | undefined = feature.getProperty('_x')
          const y: number | undefined = feature.getProperty('_y')
          const z: number | undefined = feature.getProperty('_z')
          const height: number | undefined = feature.getProperty('_height')
          if (x == null || y == null || z == null || height == null) {
            return undefined
          }
          cartographicScratch.longitude = CesiumMath.toRadians(x)
          cartographicScratch.latitude = CesiumMath.toRadians(y)
          cartographicScratch.height = z
          Cartographic.toCartesian(
            cartographicScratch,
            scene.globe.ellipsoid,
            result.center
          )
          result.radius = height / 2
          return result
        }
      })

      return null
    }
  )
)

const DeferredPlateauTilesetContent = withDeferredProps(
  ['showWireframe', 'showBoundingVolume'],
  PlateauTilesetContent
)

export interface PlateauTilesetProps
  extends Omit<
    PlateauTilesetContentProps,
    'showWireframe' | 'showBoundingVolume'
  > {}

export const PlateauTileset = forwardRef<Cesium3DTileset, PlateauTilesetProps>(
  (props, forwardedRef) => {
    const showWireframe = useAtomValue(showTilesetWireframeAtom)
    const showBoundingVolume = useAtomValue(showTilesetBoundingVolumeAtom)
    return (
      <DeferredPlateauTilesetContent
        ref={forwardedRef}
        {...props}
        showWireframe={showWireframe}
        showBoundingVolume={showBoundingVolume}
      />
    )
  }
)
