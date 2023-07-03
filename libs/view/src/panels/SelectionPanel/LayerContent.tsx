import { Divider } from '@mui/material'
import invariant from 'tiny-invariant'

import { type LayerType } from '@takram/plateau-layers'
import { InspectorHeader, InspectorItem } from '@takram/plateau-ui-components'
import { layerTypeIcons, layerTypeNames } from '@takram/plateau-view-layers'

import {
  type LAYER_SELECTION,
  type SelectionGroup
} from '../../states/selection'
import { LayerActions } from './LayerActions'
import { LayerColorSection } from './LayerColorSection'
import { LayerHiddenFeaturesSection } from './LayerHiddenFeaturesSection'
import { LayerOpacitySection } from './LayerOpacitySection'

export interface LayerContentProps<T extends LayerType> {
  values: (SelectionGroup & {
    type: typeof LAYER_SELECTION
    subtype: T
  })['values']
}

export function LayerContent<T extends LayerType>({
  values
}: LayerContentProps<T>): JSX.Element | null {
  invariant(values.length > 0)
  const type = values[0].type

  return (
    <>
      <InspectorHeader
        title={
          values.length === 1
            ? `${layerTypeNames[type]}レイヤー`
            : `${values.length}個の${layerTypeNames[type]}レイヤー`
        }
        iconComponent={layerTypeIcons[type]}
      />
      <Divider light />
      <LayerActions values={values} />
      <Divider light />
      <InspectorItem>
        <LayerHiddenFeaturesSection layers={values} />
        <LayerOpacitySection layers={values} />
        <LayerColorSection layers={values} />
      </InspectorItem>
    </>
  )
}
