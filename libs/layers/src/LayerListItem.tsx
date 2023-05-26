import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { styled } from '@mui/material'
import { useAtom, useAtomValue, useSetAtom, type PrimitiveAtom } from 'jotai'
import {
  forwardRef,
  useCallback,
  useContext,
  type ComponentPropsWithRef,
  type ComponentType,
  type MouseEvent
} from 'react'
import { mergeRefs } from 'react-merge-refs'

import { LayersContext } from './LayersContext'
import { type LayerModel, type LayerProps } from './types'

const Root = styled('div')({})

export interface LayerListItemProps extends ComponentPropsWithRef<typeof Root> {
  index: number
  layerAtom: PrimitiveAtom<LayerModel>
  itemComponent: ComponentType<LayerProps>
}

export const LayerListItem = forwardRef<HTMLDivElement, LayerListItemProps>(
  ({ index, layerAtom, itemComponent, ...props }, forwardedRef) => {
    const layer = useAtomValue(layerAtom)

    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: layer.id })

    const { selectionAtom, addSelectionAtom } = useContext(LayersContext)
    const [selection, setSelection] = useAtom(selectionAtom)
    const addSelection = useSetAtom(addSelectionAtom)
    const handleMouseDown = useCallback(
      (event: MouseEvent) => {
        if (event.shiftKey) {
          // TODO: Toggle selection
          addSelection([layer.id])
        } else {
          setSelection([layer.id])
        }
      },
      [layer.id, setSelection, addSelection]
    )

    const ItemComponent = itemComponent
    return (
      <Root
        ref={mergeRefs([forwardedRef, setNodeRef])}
        {...props}
        style={{
          transform: CSS.Translate.toString(transform),
          transition
        }}
        {...attributes}
        {...listeners}
      >
        <ItemComponent
          {...layer}
          index={index}
          selected={selection.includes(layer.id)}
          itemProps={{
            onMouseDown: handleMouseDown
          }}
        />
      </Root>
    )
  }
)
