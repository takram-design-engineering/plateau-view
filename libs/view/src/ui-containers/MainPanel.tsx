import { useAtomValue, useSetAtom } from 'jotai'
import { useCallback, useRef, useState, type FC, type MouseEvent } from 'react'

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
  const listRef = useRef<HTMLDivElement>(null)
  const handleLayersClick = useCallback(
    (event: MouseEvent) => {
      if (event.target === listRef.current) {
        clearLayerSelection()
      }
    },
    [clearLayerSelection]
  )

  return (
    <AutoHeight>
      <SearchAutocompletePanel>
        <LayerListComponent
          listRef={listRef}
          footer={`${layerAtoms.length}項目`}
          open={layersOpen}
          onOpen={handleLayersOpen}
          onClose={handleLayersClose}
          onClick={handleLayersClick}
        >
          <LayerList itemComponent={ViewLayerListItem} unmountWhenEmpty />
        </LayerListComponent>
      </SearchAutocompletePanel>
    </AutoHeight>
  )
}
