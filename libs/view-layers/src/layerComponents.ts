import { type LayerComponents } from '@plateau/layers'

import {
  BUILDING_LAYER,
  BuildingLayer,
  type BuildingLayerModel
} from './BuildingLayer'

declare module '@plateau/layers' {
  interface LayerModelOverrides {
    [BUILDING_LAYER]: BuildingLayerModel
  }
}

export const layerComponents: LayerComponents = {
  [BUILDING_LAYER]: BuildingLayer
}
