import {
  BoundingSphere,
  Cartographic,
  Cesium3DTileFeature,
  Cesium3DTileStyle,
  Cesium3DTileset,
  Math as CesiumMath,
  Color,
  ShadowMode
} from '@cesium/engine'
import { useTheme } from '@mui/material'
import { useAtomValue } from 'jotai'
import { forwardRef, useContext, useEffect, useMemo } from 'react'

import { useAsyncInstance, useCesium } from '@plateau/cesium'
import {
  assignForwardedRef,
  withDeferredProps,
  withEphemerality
} from '@plateau/react-helpers'
import { useScreenSpaceSelectionResponder } from '@plateau/screen-space-selection'

import { LambertDiffuseShader } from './LambertDiffuseShader'
import { PlateauDatasetsContext } from './PlateauDatasetsContext'
import { type TilesetPrimitiveConstructorOptions } from './types'

const cartographicScratch = new Cartographic()

interface PlateauTilesetContentProps
  extends TilesetPrimitiveConstructorOptions {
  url: string
  color?: string
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
        color,
        showWireframe = false,
        showBoundingVolume = false,
        ...props
      },
      forwardedRef
    ) => {
      const scene = useCesium(({ scene }) => scene)
      const tileset = useAsyncInstance({
        owner: scene.primitives,
        keys: [url, scene],
        create: async () =>
          await Cesium3DTileset.fromUrl(url, {
            // @ts-expect-error missing type
            customShader: LambertDiffuseShader,
            debugWireframe: showWireframe,
            debugShowBoundingVolume: showBoundingVolume,
            shadows: showWireframe ? ShadowMode.DISABLED : ShadowMode.ENABLED
          }),
        transferOwnership: (tileset, primitives) => {
          primitives.add(tileset)
          return () => {
            primitives.remove(tileset)
          }
        }
      })

      if (tileset != null) {
        tileset.debugWireframe = showWireframe
        tileset.debugShowBoundingVolume = showBoundingVolume
        Object.assign(tileset, props)
      }

      useEffect(() => {
        assignForwardedRef(forwardedRef, tileset ?? null)
      }, [forwardedRef, tileset])

      useEffect(() => {
        if (tileset == null) {
          return
        }
        if (tileset.style != null) {
          tileset.style = new Cesium3DTileStyle({
            color: `color("${color}")`
          })
        }
      }, [color, tileset])

      const theme = useTheme()
      const selectionColor = useMemo(
        () => Color.fromCssColorString(theme.palette.primary.main),
        [theme]
      )

      useScreenSpaceSelectionResponder({
        predicate: (object): object is Cesium3DTileFeature => {
          return (
            object instanceof Cesium3DTileFeature && object.tileset === tileset
          )
        },
        onSelect: features => {
          features.forEach(feature => {
            feature.color = selectionColor
          })
        },
        onDeselect: features => {
          if (tileset?.isDestroyed() !== false) {
            return
          }
          features.forEach(feature => {
            // When color is white, the feature's color is not changed.
            feature.color = Color.WHITE
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
  (props, ref) => {
    const context = useContext(PlateauDatasetsContext)
    const showWireframe = useAtomValue(context.showWireframeAtom)
    const showBoundingVolume = useAtomValue(context.showBoundingVolumeAtom)
    return (
      <DeferredPlateauTilesetContent
        ref={ref}
        {...props}
        showWireframe={showWireframe}
        showBoundingVolume={showBoundingVolume}
      />
    )
  }
)
