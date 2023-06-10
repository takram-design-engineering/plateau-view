import { styled } from '@mui/material'
import { useAtomValue } from 'jotai'
import { type FC } from 'react'

import { PLATEAU_TILE_FEATURE } from '@takram/plateau-datasets'
import { AutoHeight, FloatingPanel } from '@takram/plateau-ui-components'

import {
  LAYER_SELECTION,
  SCREEN_SPACE_SELECTION,
  selectionGroupsAtom
} from '../states/selection'
import { LayerContent } from './SelectionPanel/LayerContent'
import { TileFeatureContent } from './SelectionPanel/TileFeatureContent'

const Root = styled(FloatingPanel)({
  width: 360
})

export const SelectionPanel: FC = () => {
  let content = null
  const selectionGroups = useAtomValue(selectionGroupsAtom)
  if (selectionGroups.length === 1) {
    const [selectionGroup] = selectionGroups
    const { type, subtype } = selectionGroup
    switch (type) {
      case LAYER_SELECTION:
        content = <LayerContent values={selectionGroup.values} />
        break
      case SCREEN_SPACE_SELECTION:
        switch (subtype) {
          case PLATEAU_TILE_FEATURE:
            content = <TileFeatureContent values={selectionGroup.values} />
            break
        }
    }
  } else if (selectionGroups.length > 1) {
    content = null // TODO: Show mixed content
  }
  if (content == null) {
    return null
  }
  return (
    <AutoHeight>
      <Root scrollable deferScrollable>
        <div>{content}</div>
      </Root>
    </AutoHeight>
  )
}
