import { BoundingSphere } from '@cesium/engine'
import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect, useMemo, type FC } from 'react'

import {
  JapanSeaLevelEllipsoid,
  VectorImageryLayer
} from '@takram/plateau-datasets'

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
}

export const MVTLayerContent: FC<MVTLayerContentProps> = ({
  url,
  styles,
  boundingSphereAtom
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

  if (metadata == null) {
    return null
  }
  return (
    <VectorImageryLayer
      url={url}
      style={style}
      pixelRatio={pixelRatio}
      rectangle={metadata.rectangle}
      maximumDataZoom={metadata.maximumZoom}
    />
  )
}
