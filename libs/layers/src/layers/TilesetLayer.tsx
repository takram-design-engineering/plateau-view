import { useAtomValue } from 'jotai'
import { type FC } from 'react'

import { type LayerModel, type LayerProps } from '../types'

export const TILESET_LAYER = 'TILESET_LAYER'

export interface TilesetLayerModel extends LayerModel {
  url: string
}

declare module '@plateau/layers' {
  interface LayerModelOverrides {
    [TILESET_LAYER]: TilesetLayerModel
  }
}

export const TilesetLayer: FC<LayerProps<typeof TILESET_LAYER>> = ({
  layerAtom
}) => {
  const layer = useAtomValue(layerAtom)
  return null
}
