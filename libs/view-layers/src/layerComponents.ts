import { type LayerComponents } from '@plateau/layers'

import {
  TILESET_LAYER,
  TilesetLayer,
  type TilesetLayerModel
} from './TilesetLayer'

declare module '@plateau/layers' {
  interface LayerModelOverrides {
    [TILESET_LAYER]: TilesetLayerModel
  }
}

export const layerComponents: LayerComponents = {
  [TILESET_LAYER]: TilesetLayer
}
