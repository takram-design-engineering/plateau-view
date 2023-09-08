import { bboxPolygon } from '@turf/turf'
import axios from 'axios'
import { atom, useAtomValue, useSetAtom, type PrimitiveAtom } from 'jotai'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FC
} from 'react'
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
  title?: string
  urls: readonly string[][]
  parserOptions: ParseCSVOptions
  opacity?: number
}

export interface HeatmapLayerModel extends ViewLayerModel {
  urls: readonly string[][]
  parserOptions: ParseCSVOptions
  opacityAtom: PrimitiveAtom<number>
  contourSpacingAtom: PrimitiveAtom<number>
}

export function createHeatmapLayer(
  params: HeatmapLayerModelParams
): ConfigurableLayerModel<HeatmapLayerModel> {
  const colorMapAtom = atom<ColorMap>(colorMapFlare)
  const colorRangeAtom = atom([0, 100])
  const valueRangeAtom = atom([0, 100])
  const colorSchemeAtom = atom<LayerColorScheme | null>({
    type: 'quantitative',
    name: params.title ?? '統計データ',
    colorMapAtom,
    colorRangeAtom,
    valueRangeAtom
  })

  return {
    ...createViewLayerModel({
      ...params,
      title: params.title ?? '統計データ'
    }),
    type: HEATMAP_LAYER,
    urls: params.urls,
    parserOptions: params.parserOptions,
    opacityAtom: atom(params.opacity ?? 0.8),
    contourSpacingAtom: atom(10),
    colorSchemeAtom
  }
}

const Subdivision: FC<
  Omit<HeatmapLayerModel, 'urls'> & {
    urls: readonly string[]
    onLoad?: (data: ParseCSVResult, urls: readonly string[]) => void
  }
> = ({
  hiddenAtom,
  colorSchemeAtom,
  urls,
  parserOptions,
  opacityAtom,
  contourSpacingAtom,
  onLoad
}) => {
  const [data, setData] = useState<ParseCSVResult>()
  const onLoadRef = useRef(onLoad)
  onLoadRef.current = onLoad
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
      onLoadRef.current?.(data, urls)
    })().catch(error => {
      console.error(error)
    })
  }, [urls, parserOptions])

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

  const scene = useCesium(({ scene }) => scene)
  scene.requestRender()

  useEffect(() => {
    return () => {
      if (!scene.isDestroyed()) {
        scene.requestRender()
      }
    }
  }, [scene])

  const colorScheme = useAtomValue(colorSchemeAtom)
  invariant(colorScheme?.type === 'quantitative')
  const colorMap = useAtomValue(colorScheme.colorMapAtom)
  const colorRange = useAtomValue(colorScheme.colorRangeAtom)
  const contourSpacing = useAtomValue(contourSpacingAtom)

  const hidden = useAtomValue(hiddenAtom)
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

function extendRange(a: number[], b: number[]): [number, number] {
  invariant(a.length === 2)
  invariant(b.length === 2)
  return [Math.min(a[0], b[0]), Math.max(a[1], b[1])]
}

export const HeatmapLayer: FC<LayerProps<typeof HEATMAP_LAYER>> = props => {
  const colorScheme = useAtomValue(props.colorSchemeAtom)
  invariant(colorScheme?.type === 'quantitative')
  const setColorRange = useSetAtom(colorScheme.colorRangeAtom)
  const setValueRange = useSetAtom(colorScheme.valueRangeAtom)
  const setContourSpacing = useSetAtom(props.contourSpacingAtom)

  const handleLoad = useCallback(
    (data: ParseCSVResult) => {
      setValueRange(prevValue => extendRange(prevValue, [0, data.maxValue]))
      setContourSpacing(prevValue =>
        Math.max(prevValue, data.outlierThreshold / 20)
      )
      setColorRange(prevValue =>
        extendRange(prevValue, [0, data.outlierThreshold])
      )
    },
    [setValueRange, setContourSpacing, setColorRange]
  )

  return (
    <>
      {props.urls.map((urls, index) => (
        <Subdivision key={index} {...props} urls={urls} onLoad={handleLoad} />
      ))}
    </>
  )
}
