import { useAtomValue } from 'jotai'
import { useMemo, type FC } from 'react'

import { VectorImageryLayer } from '@takram/plateau-datasets'
import { type PlateauDatasetFormat } from '@takram/plateau-graphql'

import { pixelRatioAtom } from './states'
import { type DatasetDatum } from './useDatasetDatum'
import { useMVTMetadata } from './useMVTMetadata'

// TODO: Refine types
export interface MVTLayerContentStyle {
  filter?: any[]
  type: any
  paint: any
}

export interface MVTLayerContentProps {
  datum: DatasetDatum<PlateauDatasetFormat.Mvt>
  styles: readonly MVTLayerContentStyle[]
}

export const MVTLayerContent: FC<MVTLayerContentProps> = ({
  datum,
  styles
}) => {
  const metadata = useMVTMetadata(datum?.url)
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

  const pixelRatio = useAtomValue(pixelRatioAtom)

  if (metadata == null) {
    return null
  }
  return (
    <VectorImageryLayer
      url={datum.url}
      style={style}
      pixelRatio={pixelRatio}
      rectangle={metadata.rectangle}
      maximumDataZoom={metadata.maximumZoom}
    />
  )
}
