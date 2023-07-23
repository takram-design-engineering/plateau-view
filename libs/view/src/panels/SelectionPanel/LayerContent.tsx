import { Divider, List } from '@mui/material'
import { useSetAtom } from 'jotai'
import { useCallback } from 'react'
import invariant from 'tiny-invariant'

import { layerSelectionAtom, type LayerType } from '@takram/plateau-layers'
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
import { LayerShowWireframeSection } from './LayerShowWireframeSection'

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

  const setSelection = useSetAtom(layerSelectionAtom)
  const handleClose = useCallback(() => {
    setSelection([])
  }, [setSelection])

  return (
    <List disablePadding>
      <InspectorHeader
        title={
          values.length === 1
            ? `${layerTypeNames[type]}レイヤー`
            : `${values.length}個の${layerTypeNames[type]}レイヤー`
        }
        iconComponent={layerTypeIcons[type]}
        onClose={handleClose}
      />
      <Divider light />
      <LayerActions values={values} />
      <Divider light />
      <InspectorItem>
        <LayerHiddenFeaturesSection layers={values} />
        <LayerOpacitySection layers={values} />
        <LayerShowWireframeSection layers={values} />
        <LayerColorSection layers={values} />
      </InspectorItem>
    </List>
  )
}
