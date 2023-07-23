import { Divider, IconButton, List, Tooltip } from '@mui/material'
import { useSetAtom } from 'jotai'
import { useCallback, useState, type FC } from 'react'

import { type PLATEAU_TILE_FEATURE } from '@takram/plateau-datasets'
import { withEphemerality } from '@takram/plateau-react-helpers'
import { screenSpaceSelectionAtom } from '@takram/plateau-screen-space-selection'
import {
  BuildingIcon,
  InspectorActions,
  InspectorHeader,
  VisibilityOffIcon,
  VisibilityOnIcon
} from '@takram/plateau-ui-components'
import { hideFeaturesAtom, showFeaturesAtom } from '@takram/plateau-view-layers'

import {
  type SCREEN_SPACE_SELECTION,
  type SelectionGroup
} from '../../states/selection'

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
    const [hidden, setHidden] = useState(false)
    const hideFeatures = useSetAtom(hideFeaturesAtom)
    const showFeatures = useSetAtom(showFeaturesAtom)
    const handleHide = useCallback(() => {
      hideFeatures(values.map(value => value.key))
      setHidden(true)
    }, [values, hideFeatures])
    const handleShow = useCallback(() => {
      showFeatures(values.map(value => value.key))
      setHidden(false)
    }, [values, showFeatures])

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
        <InspectorActions>
          <Tooltip title={hidden ? '表示' : '隠す'}>
            <IconButton
              color='inherit'
              aria-label={hidden ? '表示' : '隠す'}
              onClick={hidden ? handleShow : handleHide}
            >
              {hidden ? <VisibilityOffIcon /> : <VisibilityOnIcon />}
            </IconButton>
          </Tooltip>
        </InspectorActions>
      </List>
    )
  }
)
