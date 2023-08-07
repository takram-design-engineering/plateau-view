import { useAtomValue, useSetAtom } from 'jotai'
import { useCallback, useState, type FC } from 'react'

import {
  clearLayerSelectionAtom,
  layerAtomsAtom,
  LayerList
} from '@takram/plateau-layers'
import {
  AutoHeight,
  LayerList as LayerListComponent
} from '@takram/plateau-ui-components'
import { ViewLayerListItem } from '@takram/plateau-view-layers'

import { SearchAutocompletePanel } from './SearchAutocompletePanel'

export const MainPanel: FC = () => {
  const layerAtoms = useAtomValue(layerAtomsAtom)
  const [layersOpen, setLayersOpen] = useState(false)
  const handleLayersOpen = useCallback(() => {
    setLayersOpen(true)
  }, [])
  const handleLayersClose = useCallback(() => {
    setLayersOpen(false)
  }, [])

  const clearLayerSelection = useSetAtom(clearLayerSelectionAtom)
  const handleLayersMouseDown = useCallback(() => {
    clearLayerSelection()
  }, [clearLayerSelection])

  return (
    <AutoHeight>
      <SearchAutocompletePanel>
        <LayerListComponent
          footer={`${layerAtoms.length}項目`}
          open={layersOpen}
          onOpen={handleLayersOpen}
          onClose={handleLayersClose}
          onMouseDown={handleLayersMouseDown}
        >
          <LayerList itemComponent={ViewLayerListItem} unmountWhenEmpty />
        </LayerListComponent>
      </SearchAutocompletePanel>
    </AutoHeight>
  )
}
