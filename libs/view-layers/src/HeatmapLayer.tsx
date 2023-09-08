import {
  BoundingSphere,
  Intersect,
  PerspectiveFrustum,
  Rectangle
} from '@cesium/engine'
import { bboxPolygon } from '@turf/turf'
import axios from 'axios'
import { atom, useAtomValue, useSetAtom, type PrimitiveAtom } from 'jotai'
import {
  memo,
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
  createMeshDataAsync,
  createMeshImageData,
  HeatmapMesh,
  parseCSVAsync,
  type MeshImageData,
  type ParseCSVOptions,
  type ParseCSVResult
} from '@takram/plateau-heatmap'
import { type LayerProps } from '@takram/plateau-layers'
import {
  convertCodeToBounds,
  inferMeshType
} from '@takram/plateau-regional-mesh'

import {
  createViewLayerModel,
  type ViewLayerModel,
  type ViewLayerModelParams
} from './createViewLayerModel'
import { HEATMAP_LAYER } from './layerTypes'
import { type ConfigurableLayerModel, type LayerColorScheme } from './types'

export interface HeatmapLayerModelParams extends ViewLayerModelParams {
  title?: string
  getUrl: (code: string) => string | undefined
  codes: readonly string[]
  parserOptions: ParseCSVOptions
  opacity?: number
}

export interface HeatmapLayerModel extends ViewLayerModel {
  getUrl: (code: string) => string | undefined
  codes: readonly string[]
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
    getUrl: params.getUrl,
    codes: params.codes,
    parserOptions: params.parserOptions,
    opacityAtom: atom(params.opacity ?? 0.8),
    valueRangeAtom,
    contourSpacingAtom: atom(10),
    colorSchemeAtom
  }
}

const Subdivision: FC<
  Omit<HeatmapLayerModel, 'getUrl' | 'codes'> & {
    url: string
    boundingSphere: BoundingSphere
    onLoad?: (data: ParseCSVResult, url: string) => void
  }
> = memo(
  ({
    hiddenAtom,
    colorSchemeAtom,
    url,
    boundingSphere,
    parserOptions,
    opacityAtom,
    contourSpacingAtom,
    onLoad
  }) => {
    const scene = useCesium(({ scene }) => scene)

    const [visible, setVisible] = useState(false)
    useEffect(() => {
      const isVisible = (): boolean => {
        const camera = scene.camera
        const frustum = camera.frustum
        invariant(frustum instanceof PerspectiveFrustum)
        const cullingVolume = frustum.computeCullingVolume(
          camera.position,
          camera.direction,
          camera.up
        )
        return (
          cullingVolume.computeVisibility(boundingSphere) !== Intersect.OUTSIDE
        )
      }
      if (isVisible()) {
        setVisible(true)
        return
      }
      const callback = (): void => {
        if (isVisible()) {
          setVisible(true)
          scene.camera.changed.removeEventListener(callback)
        }
      }
      scene.camera.changed.addEventListener(callback)
      return () => {
        scene.camera.changed.removeEventListener(callback)
      }
    }, [boundingSphere, scene])

    useEffect(() => {
      return () => {
        if (!scene.isDestroyed()) {
          scene.requestRender()
        }
      }
    }, [scene])

    const [data, setData] = useState<ParseCSVResult>()
    const onLoadRef = useRef(onLoad)
    onLoadRef.current = onLoad
    useEffect(() => {
      if (!visible) {
        return
      }
      let canceled = false
      ;(async () => {
        const response = await axios(url, {
          baseURL: process.env.NEXT_PUBLIC_DATA_BASE_URL
        })
        if (canceled) {
          return
        }
        const data = await parseCSVAsync(response.data, parserOptions)
        if (canceled) {
          return
        }
        setData(data)
        onLoadRef.current?.(data, url)
      })().catch(error => {
        console.error(error)
      })
      return () => {
        canceled = true
      }
    }, [url, parserOptions, visible])

    const [meshImageData, setMeshImageData] = useState<MeshImageData>()
    useEffect(() => {
      if (data == null) {
        setMeshImageData(undefined)
        return
      }
      let canceled = false
      ;(async () => {
        const meshData = await createMeshDataAsync(data)
        if (canceled) {
          return
        }
        const meshImageData = createMeshImageData(meshData)
        setMeshImageData(meshImageData)
      })().catch(error => {
        console.error(error)
      })
      return () => {
        canceled = true
      }
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
)

function extendRange(a: number[], b: number[]): [number, number] {
  invariant(a.length === 2)
  invariant(b.length === 2)
  return [Math.min(a[0], b[0]), Math.max(a[1], b[1])]
}

export const HeatmapLayer: FC<LayerProps<typeof HEATMAP_LAYER>> = ({
  getUrl,
  codes,
  ...props
}) => {
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

  const propsArray = useMemo(
    () =>
      codes.map(code => {
        const url = getUrl(code)
        const meshType = inferMeshType(code)
        if (url == null || meshType == null) {
          return undefined
        }
        const bounds = convertCodeToBounds(code, meshType)
        const boundingSphere = BoundingSphere.fromRectangle3D(
          Rectangle.fromDegrees(
            bounds.west,
            bounds.south,
            bounds.east,
            bounds.north
          )
        )
        return { url, boundingSphere }
      }),
    [getUrl, codes]
  )
  return (
    <>
      {propsArray.map(
        additionalProps =>
          additionalProps != null && (
            <Subdivision
              key={additionalProps.url}
              {...props}
              {...additionalProps}
              onLoad={handleLoad}
            />
          )
      )}
    </>
  )
}
