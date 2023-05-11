import {
  BoundingSphere,
  Cesium3DTileFeature,
  Cesium3DTileStyle,
  Cesium3DTileset,
  Color,
  CustomShader,
  CustomShaderMode,
  CustomShaderTranslucencyMode,
  LightingModel,
  ShadowMode
} from '@cesium/engine'
import { useTheme } from '@mui/material'
import { useAtomValue } from 'jotai'
import { useContext, useEffect, useMemo, type FC } from 'react'
import { type Primitive } from 'type-fest'

import { useAsyncInstance, useCesium } from '@plateau/cesium'
import { withDeferredProps, withEphemerality } from '@plateau/react-helpers'
import { useScreenSpaceSelectionResponder } from '@plateau/screen-space-selection'

import { PlateauDatasetsContext } from './PlateauDatasetsContext'

// Total Lambert diffuse
const customShader = new CustomShader({
  mode: CustomShaderMode.MODIFY_MATERIAL, // Need lighting
  lightingModel: LightingModel.PBR,
  translucencyMode: CustomShaderTranslucencyMode.OPAQUE,
  fragmentShaderText: /* glsl */ `
    void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
      material.diffuse = vec3(1.0);
      material.specular = vec3(0.0);
      material.emissive = vec3(0.0);
      material.alpha = 1.0;
    }
  `
})

type PrimitiveOptions = {
  [K in keyof Cesium3DTileset.ConstructorOptions]: Cesium3DTileset.ConstructorOptions[K] extends Primitive
    ? Cesium3DTileset.ConstructorOptions[K]
    : never
}

interface PlateauTilesetContentProps extends PrimitiveOptions {
  url: string
  color?: string
  showWireframe?: boolean
  showBoundingVolume?: boolean
}

const PlateauTilesetContent = withEphemerality(
  () => useCesium(({ scene }) => scene).primitives,
  ['url'],
  ({
    url,
    color,
    showWireframe = false,
    showBoundingVolume = false,
    ...props
  }: PlateauTilesetContentProps) => {
    const scene = useCesium(({ scene }) => scene)
    const tileset = useAsyncInstance({
      owner: scene.primitives,
      keys: [url, scene],
      create: async () =>
        await Cesium3DTileset.fromUrl(url, {
          // @ts-expect-error missing type
          customShader,
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
        result.center.x = x
        result.center.y = y
        result.center.z = z
        result.radius = height / 2
        return result
      }
    })

    return null
  }
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

export const PlateauTileset: FC<PlateauTilesetProps> = props => {
  const context = useContext(PlateauDatasetsContext)
  const showWireframe = useAtomValue(context.showWireframeAtom)
  const showBoundingVolume = useAtomValue(context.showBoundingVolumeAtom)
  return (
    <DeferredPlateauTilesetContent
      {...props}
      showWireframe={showWireframe}
      showBoundingVolume={showBoundingVolume}
    />
  )
}
