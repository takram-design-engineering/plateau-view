import { bboxPolygon } from '@turf/turf'
import axios from 'axios'
import {
  atom,
  useAtom,
  useAtomValue,
  useSetAtom,
  type PrimitiveAtom
} from 'jotai'
import { useEffect, useMemo, useState, type FC } from 'react'
import invariant from 'tiny-invariant'

import { useCesium } from '@takram/plateau-cesium'
import { colorMapFlare, type ColorMap } from '@takram/plateau-color-maps'
import {
  createMeshData,
  createMeshImageData,
  HeatmapMesh,
  parseCSV,
  type MeshImageData,
  type ParseCSVOptions,
  type ParseCSVResult
} from '@takram/plateau-heatmap'
import { type LayerProps } from '@takram/plateau-layers'

import {
  createViewLayerModel,
  type ViewLayerModel,
  type ViewLayerModelParams
} from './createViewLayerModel'
import { HEATMAP_LAYER } from './layerTypes'
import { type ConfigurableLayerModel, type LayerColorScheme } from './types'

export interface HeatmapLayerModelParams extends ViewLayerModelParams {
  urls: string[]
  parserOptions: ParseCSVOptions
  opacity?: number
}

export interface HeatmapLayerModel extends ViewLayerModel {
  urls: string[]
  parserOptions: ParseCSVOptions
  opacityAtom: PrimitiveAtom<number>
  valueRangeAtom: PrimitiveAtom<number[]>
  contourSpacingAtom: PrimitiveAtom<number>
}

export function createHeatmapLayer(
  params: HeatmapLayerModelParams
): ConfigurableLayerModel<HeatmapLayerModel> {
  const colorMapAtom = atom<ColorMap>(colorMapFlare)
  const colorRangeAtom = atom([0, 100])
  const colorSchemeAtom = atom<LayerColorScheme | null>({
    type: 'quantitative',
    name: '統計データ',
    colorMapAtom,
    colorRangeAtom
  })

  return {
    ...createViewLayerModel({
      ...params,
      title: '統計データ'
    }),
    type: HEATMAP_LAYER,
    urls: params.urls,
    parserOptions: params.parserOptions,
    opacityAtom: atom(params.opacity ?? 0.8),
    valueRangeAtom: atom([0, 100]),
    contourSpacingAtom: atom(10),
    colorSchemeAtom
  }
}

export const HeatmapLayer: FC<LayerProps<typeof HEATMAP_LAYER>> = ({
  hiddenAtom,
  boundingSphereAtom,
  colorSchemeAtom,
  urls,
  parserOptions,
  opacityAtom,
  valueRangeAtom,
  contourSpacingAtom
}) => {
  const hidden = useAtomValue(hiddenAtom)
  const scene = useCesium(({ scene }) => scene)
  scene.requestRender()

  useEffect(() => {
    return () => {
      if (!scene.isDestroyed()) {
        scene.requestRender()
      }
    }
  }, [scene])

  const setValueRange = useSetAtom(valueRangeAtom)
  const [contourSpacing, setContourSpacing] = useAtom(contourSpacingAtom)

  const colorScheme = useAtomValue(colorSchemeAtom)
  invariant(colorScheme?.type === 'quantitative')
  const colorMap = useAtomValue(colorScheme.colorMapAtom)
  const [colorRange, setColorRange] = useAtom(colorScheme.colorRangeAtom)

  const [data, setData] = useState<ParseCSVResult>()
  useEffect(() => {
    ;(async () => {
      const responses = await Promise.all(
        urls.map(
          async url =>
            await axios(url, {
              baseURL: process.env.NEXT_PUBLIC_DATA_BASE_URL,
              responseType: 'arraybuffer'
            })
        )
      )
      const data = parseCSV(
        // TODO: Auto-detect encoding
        responses.map(response =>
          new TextDecoder('shift-jis').decode(response.data)
        ),
        parserOptions
      )
      setData(data)
      setValueRange([0, data.maxValue])
      setContourSpacing(data.outlierThreshold / 20)
      setColorRange([0, data.outlierThreshold])
    })().catch(error => {
      console.error(error)
    })
  }, [urls, parserOptions, setValueRange, setContourSpacing, setColorRange])

  const [meshImageData, setMeshImageData] = useState<MeshImageData>()
  useEffect(() => {
    if (data == null) {
      setMeshImageData(undefined)
      return
    }
    const meshData = createMeshData(data)
    const meshImageData = createMeshImageData(meshData)
    setMeshImageData(meshImageData)
  }, [data])

  const geometry = useMemo(
    () =>
      meshImageData != null
        ? bboxPolygon([
            meshImageData.bounds.east,
            meshImageData.bounds.south,
            meshImageData.bounds.west,
            meshImageData.bounds.north
          ]).geometry
        : undefined,
    [meshImageData]
  )

  const opacity = useAtomValue(opacityAtom)

  if (hidden || meshImageData == null || geometry == null) {
    return null
  }
  return (
    <HeatmapMesh
      meshImageData={meshImageData}
      geometry={geometry}
      colorMap={colorMap}
      opacity={opacity}
      minValue={colorRange[0]}
      maxValue={colorRange[1]}
      contourSpacing={contourSpacing}
    />
  )
}
