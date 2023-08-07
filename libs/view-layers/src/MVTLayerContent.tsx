import { BoundingSphere } from '@cesium/engine'
import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect, useMemo, useRef, type FC } from 'react'

import { type ImageryLayerHandle } from '@takram/plateau-cesium'
import {
  JapanSeaLevelEllipsoid,
  VectorImageryLayer
} from '@takram/plateau-datasets'
import { type LayerModelHandleRef } from '@takram/plateau-layers'

import { type DatasetLayerModel } from './createDatasetLayerModel'
import { type MVTLayerState } from './createMVTLayerState'
import { pixelRatioAtom } from './states'
import { useMVTMetadata } from './useMVTMetadata'

// TODO: Refine types
export interface MVTLayerContentStyle {
  filter?: any[]
  type: any
  paint: any
}

export interface MVTLayerContentProps
  extends Pick<DatasetLayerModel, 'boundingSphereAtom'>,
    Pick<MVTLayerState, 'opacityAtom'> {
  handleRef: LayerModelHandleRef
  url: string
  styles: readonly MVTLayerContentStyle[]
}

export const MVTLayerContent: FC<MVTLayerContentProps> = ({
  handleRef,
  url,
  styles,
  boundingSphereAtom,
  opacityAtom
}) => {
  const metadata = useMVTMetadata(url)
  const style = useMemo(() => {
    if (metadata == null) {
      return
    }
    return {
      version: 8,
      layers: metadata.sourceLayers.flatMap(layer =>
        styles.map(({ filter, type, paint }) => ({
          'source-layer': layer.id,
          type,
          paint,
          ...(filter != null && { filter })
        }))
      )
    }
  }, [metadata, styles])

  const setBoundingSphere = useSetAtom(boundingSphereAtom)
  useEffect(() => {
    if (metadata == null) {
      return
    }
    setBoundingSphere(
      BoundingSphere.fromRectangle3D(metadata.rectangle, JapanSeaLevelEllipsoid)
    )
  }, [metadata, setBoundingSphere])

  const pixelRatio = useAtomValue(pixelRatioAtom)
  const opacity = useAtomValue(opacityAtom)

  const ref = useRef<ImageryLayerHandle>(null)
  useEffect(() => {
    handleRef.current = {
      bringToFront: () => {
        ref.current?.bringToFront()
      }
    }
  }, [handleRef])

  if (metadata == null) {
    return null
  }
  return (
    <VectorImageryLayer
      ref={ref}
      url={url}
      style={style}
      pixelRatio={pixelRatio}
      rectangle={metadata.rectangle}
      maximumDataZoom={metadata.maximumZoom}
      alpha={opacity}
    />
  )
}
