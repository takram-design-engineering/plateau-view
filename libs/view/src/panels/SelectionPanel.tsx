import { useAtomValue } from 'jotai'
import { Resizable } from 're-resizable'
import { type FC } from 'react'

import { PLATEAU_TILE_FEATURE } from '@takram/plateau-datasets'
import { AutoHeight, FloatingPanel } from '@takram/plateau-ui-components'
import { PEDESTRIAN_LAYER } from '@takram/plateau-view-layers'

import {
  LAYER_SELECTION,
  SCREEN_SPACE_SELECTION,
  selectionGroupsAtom
} from '../states/selection'
import { LayerContent } from './SelectionPanel/LayerContent'
import { PedestrianLayerContent } from './SelectionPanel/PedestrianLayerContent'
import { TileFeatureContent } from './SelectionPanel/TileFeatureContent'

export const SelectionPanel: FC = () => {
  let content = null
  const selectionGroups = useAtomValue(selectionGroupsAtom)
  if (selectionGroups.length === 1) {
    const [selectionGroup] = selectionGroups
    const { type, subtype } = selectionGroup
    switch (type) {
      case LAYER_SELECTION:
        switch (subtype) {
          case PEDESTRIAN_LAYER:
            content = <PedestrianLayerContent values={selectionGroup.values} />
            break
          default:
            content = <LayerContent values={selectionGroup.values} />
            break
        }
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
      <FloatingPanel scrollable deferScrollable>
        <Resizable
          defaultSize={{
            width: 360,
            height: 'auto'
          }}
          minWidth={360}
          enable={{
            top: false,
            right: false,
            bottom: false,
            left: true,
            topRight: false,
            bottomRight: false,
            bottomLeft: false,
            topLeft: false
          }}
        >
          <div>{content}</div>
        </Resizable>
      </FloatingPanel>
    </AutoHeight>
  )
}
