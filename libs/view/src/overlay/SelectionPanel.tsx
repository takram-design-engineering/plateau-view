import { useAtom, useAtomValue } from 'jotai'
import { type ResizeCallback } from 're-resizable'
import { useCallback, type FC } from 'react'

import { PLATEAU_TILE_FEATURE } from '@takram/plateau-datasets'
import { PEDESTRIAN_OBJECT } from '@takram/plateau-pedestrian'
import { Inspector } from '@takram/plateau-ui-components'
import { PEDESTRIAN_LAYER } from '@takram/plateau-view-layers'

import { ColorSchemeContent } from '../selection/ColorSchemeContent'
import { LayerContent } from '../selection/LayerContent'
import { PedestrianLayerContent } from '../selection/PedestrianLayerContent'
import { TileFeatureContent } from '../selection/TileFeatureContent'
import { inspectorWidthAtom, pedestrianInspectorWidthAtom } from '../states/app'
import {
  COLOR_SCHEME_SELECTION,
  LAYER_SELECTION,
  SCREEN_SPACE_SELECTION,
  selectionGroupsAtom
} from '../states/selection'

export const SelectionPanel: FC = () => {
  let content = null
  let contentType: 'default' | 'pedestrian' = 'default'
  const selectionGroups = useAtomValue(selectionGroupsAtom)
  if (selectionGroups.length === 1) {
    const [selectionGroup] = selectionGroups
    const { type, subtype } = selectionGroup
    switch (type) {
      case LAYER_SELECTION:
        switch (subtype) {
          case PEDESTRIAN_LAYER:
            content = <PedestrianLayerContent values={selectionGroup.values} />
            contentType = 'pedestrian'
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
          case PEDESTRIAN_OBJECT:
            content = <PedestrianLayerContent values={selectionGroup.values} />
            contentType = 'pedestrian'
            break
        }
        break
      case COLOR_SCHEME_SELECTION:
        content = <ColorSchemeContent values={selectionGroup.values} />
        break
    }
  } else if (selectionGroups.length > 1) {
    content = null // TODO: Show mixed content
  }

  const [inspectorWidth, setInspectorWidth] = useAtom(inspectorWidthAtom)
  const handleResizeStop: ResizeCallback = useCallback(
    (event, direction, element, delta) => {
      setInspectorWidth(prevValue => prevValue + delta.width)
    },
    [setInspectorWidth]
  )

  const [pedestrianInspectorWidth, setPedestrianInspectorWidth] = useAtom(
    pedestrianInspectorWidthAtom
  )
  const handlePedestrianResizeStop: ResizeCallback = useCallback(
    (event, direction, element, delta) => {
      setPedestrianInspectorWidth(prevValue => prevValue + delta.width)
    },
    [setPedestrianInspectorWidth]
  )

  if (content == null) {
    return null
  }
  if (contentType === 'pedestrian') {
    return (
      <Inspector
        key='pedestrian'
        defaultWidth={pedestrianInspectorWidth}
        onResizeStop={handlePedestrianResizeStop}
      >
        <div>{content}</div>
      </Inspector>
    )
  }
  return (
    <Inspector
      key='default'
      defaultWidth={inspectorWidth}
      onResizeStop={handleResizeStop}
    >
      <div>{content}</div>
    </Inspector>
  )
}
