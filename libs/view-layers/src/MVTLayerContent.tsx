import { BoundingSphere } from '@cesium/engine'
import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect, useMemo, useRef, type FC } from 'react'

import { type ImageryLayerHandle } from '@takram/plateau-cesium'
import {
  JapanSeaLevelEllipsoid,
  VectorImageryLayer
} from '@takram/plateau-datasets'
import { type LayerModelHandleRef } from '@takram/plateau-layers'

import { type DatasetLayerModel } from './createDatasetLayerBase'
import { pixelRatioAtom } from './states'
import { useMVTMetadata } from './useMVTMetadata'

// TODO: Refine types
export interface MVTLayerContentStyle {
  filter?: any[]
  type: any
  paint: any
}

export interface MVTLayerContentProps
  extends Pick<DatasetLayerModel, 'boundingSphereAtom'> {
  url: string
  styles: readonly MVTLayerContentStyle[]
  handleRef: LayerModelHandleRef
}

export const MVTLayerContent: FC<MVTLayerContentProps> = ({
  url,
  styles,
  boundingSphereAtom,
  handleRef
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
    />
  )
}
