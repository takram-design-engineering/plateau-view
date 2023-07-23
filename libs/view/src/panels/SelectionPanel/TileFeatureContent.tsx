import { Divider, List } from '@mui/material'
import { useSetAtom } from 'jotai'
import { useCallback, type FC } from 'react'

import { type PLATEAU_TILE_FEATURE } from '@takram/plateau-datasets'
import { withEphemerality } from '@takram/plateau-react-helpers'
import { screenSpaceSelectionAtom } from '@takram/plateau-screen-space-selection'
import { BuildingIcon, InspectorHeader } from '@takram/plateau-ui-components'

import {
  type SCREEN_SPACE_SELECTION,
  type SelectionGroup
} from '../../states/selection'
import { TileFeatureActions } from './TileFeatureActions'

export interface TileFeatureContentProps {
  values: (SelectionGroup & {
    type: typeof SCREEN_SPACE_SELECTION
    subtype: typeof PLATEAU_TILE_FEATURE
  })['values']
}

export const TileFeatureContent: FC<TileFeatureContentProps> = withEphemerality(
  null,
  ['values'],
  ({ values }) => {
    const setSelection = useSetAtom(screenSpaceSelectionAtom)
    const handleClose = useCallback(() => {
      setSelection([])
    }, [setSelection])

    return (
      <List disablePadding>
        <InspectorHeader
          // TODO: Change name and icon according to the feature type.
          title={`${values.length}個の建築物`}
          iconComponent={BuildingIcon}
          onClose={handleClose}
        />
        <Divider light />
        <TileFeatureActions values={values} />
      </List>
    )
  }
)
