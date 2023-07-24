import { IconButton, Tooltip } from '@mui/material'
import { useAtomValue, useSetAtom } from 'jotai'
import { useCallback, useState } from 'react'

import { type PLATEAU_TILE_FEATURE } from '@takram/plateau-datasets'
import { layerSelectionAtom } from '@takram/plateau-layers'
import {
  InspectorActions,
  LayerIcon,
  VisibilityOffIcon,
  VisibilityOnIcon
} from '@takram/plateau-ui-components'
import {
  hideFeaturesAtom,
  highlightedTilesetLayersAtom,
  showFeaturesAtom
} from '@takram/plateau-view-layers'

import {
  type SCREEN_SPACE_SELECTION,
  type SelectionGroup
} from '../../states/selection'

export interface TileFeatureActionsProps {
  values: (SelectionGroup & {
    type: typeof SCREEN_SPACE_SELECTION
    subtype: typeof PLATEAU_TILE_FEATURE
  })['values']
}

export function TileFeatureActions({
  values
}: TileFeatureActionsProps): JSX.Element | null {
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

  const tilesetLayers = useAtomValue(highlightedTilesetLayersAtom)
  const setLayerSelection = useSetAtom(layerSelectionAtom)
  const handleSelectLayers = useCallback(() => {
    setLayerSelection(tilesetLayers.map(layer => layer.id))
  }, [tilesetLayers, setLayerSelection])

  return (
    <InspectorActions>
      <Tooltip title='レイヤーを選択'>
        <IconButton
          color='inherit'
          aria-label='レイヤーを選択'
          onClick={handleSelectLayers}
        >
          <LayerIcon />
        </IconButton>
      </Tooltip>
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
  )
}
