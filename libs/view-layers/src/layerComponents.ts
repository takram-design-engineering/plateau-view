import { type PrimitiveAtom } from 'jotai'

import { type LayerComponents } from '@plateau/layers'

import {
  BUILDING_LAYER,
  BuildingLayer,
  type BuildingLayerModel
} from './BuildingLayer'

declare module '@plateau/layers' {
  interface LayerModel {
    titleAtom: PrimitiveAtom<string | null>
    loadingAtom: PrimitiveAtom<boolean>
    hiddenAtom: PrimitiveAtom<boolean>
    selectedAtom: PrimitiveAtom<boolean>
  }

  interface LayerModelOverrides {
    [BUILDING_LAYER]: BuildingLayerModel
  }
}

export const layerComponents: LayerComponents = {
  [BUILDING_LAYER]: BuildingLayer
}
