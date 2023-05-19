import { PlateauDatasetType } from '@plateau/graphql'
import { BRIDGE_LAYER, BUILDING_LAYER } from '@plateau/view-layers'

export const layerTypes = {
  [PlateauDatasetType.Bridge]: BRIDGE_LAYER,
  [PlateauDatasetType.Building]: BUILDING_LAYER
}
