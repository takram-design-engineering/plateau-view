import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { styled } from '@mui/material'
import { useAtomValue, type PrimitiveAtom } from 'jotai'
import {
  forwardRef,
  type ComponentPropsWithRef,
  type ComponentType
} from 'react'
import { mergeRefs } from 'react-merge-refs'

import { type LayerModel, type LayerProps } from './types'

const Root = styled('div')({})

export interface LayerListItemProps extends ComponentPropsWithRef<typeof Root> {
  layerAtom: PrimitiveAtom<LayerModel>
  ItemComponent: ComponentType<LayerProps>
}

export const LayerListItem = forwardRef<HTMLDivElement, LayerListItemProps>(
  ({ layerAtom, ItemComponent, ...props }, forwardedRef) => {
    const layer = useAtomValue(layerAtom)

    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: layer.id })

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
        <ItemComponent layerAtom={layerAtom} />
      </Root>
    )
  }
)
