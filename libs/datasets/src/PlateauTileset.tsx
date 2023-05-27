import {
  BoundingSphere,
  Cartographic,
  Cesium3DTileFeature,
  Cesium3DTileset,
  Math as CesiumMath,
  ShadowMode,
  type Cesium3DTileStyle,
  type ClassificationType,
  type Color
} from '@cesium/engine'
import { useAtomValue } from 'jotai'
import { forwardRef, useEffect } from 'react'

import { useAsyncInstance, useCesium } from '@takram/plateau-cesium'
import {
  assignForwardedRef,
  withDeferredProps,
  withEphemerality
} from '@takram/plateau-react-helpers'
import { useScreenSpaceSelectionResponder } from '@takram/plateau-screen-space-selection'

import { LambertDiffuseShader } from './LambertDiffuseShader'
import {
  showTilesetBoundingVolumeAtom,
  showTilesetWireframeAtom
} from './states'
import { type TilesetPrimitiveConstructorOptions } from './types'

const cartographicScratch = new Cartographic()

interface PlateauTilesetContentProps
  extends TilesetPrimitiveConstructorOptions {
  url: string
  style?: Cesium3DTileStyle
  selectionColor?: Color
  disableShadow?: boolean
  classificationType?: ClassificationType
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
        selectionColor,
        disableShadow = false,
        classificationType,
        showWireframe = false,
        showBoundingVolume = false,
        ...props
      },
      forwardedRef
    ) => {
      const scene = useCesium(({ scene }) => scene)
      const tileset = useAsyncInstance({
        owner: scene.primitives,
        keys: [url, scene, classificationType],
        create: async () =>
          await Cesium3DTileset.fromUrl(url, {
            // @ts-expect-error missing type
            customShader: LambertDiffuseShader,
            shadows:
              disableShadow || showWireframe
                ? ShadowMode.DISABLED
                : ShadowMode.ENABLED,
            classificationType,
            debugWireframe: showWireframe,
            debugShowBoundingVolume: showBoundingVolume
          }),
        transferOwnership: (tileset, primitives) => {
          primitives.add(tileset)
          return () => {
            primitives.remove(tileset)
          }
        }
      })

      if (tileset != null) {
        tileset.style = style
        tileset.shadows =
          disableShadow || showWireframe
            ? ShadowMode.DISABLED
            : ShadowMode.ENABLED
        tileset.debugWireframe = showWireframe
        tileset.debugShowBoundingVolume = showBoundingVolume
        Object.assign(tileset, props)
      }

      useEffect(() => {
        assignForwardedRef(forwardedRef, tileset ?? null)
      }, [forwardedRef, tileset])

      useScreenSpaceSelectionResponder({
        predicate: (object): object is Cesium3DTileFeature => {
          return (
            object instanceof Cesium3DTileFeature && object.tileset === tileset
          )
        },
        onSelect: features => {
          if (selectionColor == null) {
            return
          }
          features.forEach(feature => {
            feature.color = selectionColor
          })
        },
        onDeselect: features => {
          if (tileset?.isDestroyed() !== false) {
            return
          }
          if (style == null) {
            return
          }
          features.forEach(feature => {
            try {
              // When color is white, the feature's color is not changed.
              feature.color = style.color.evaluateColor(feature)
            } catch (error) {
              if (process.env.NODE_ENV !== 'production') {
                // TODO: Remove features in unloaded tiles. This happens only
                // with PLATEAU 2022 tilesets where refinement is replacement.
                console.warn('Error during deselecting feature.')
              }
            }
          })
        },
        computeBoundingSphere: (feature, result = new BoundingSphere()) => {
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
