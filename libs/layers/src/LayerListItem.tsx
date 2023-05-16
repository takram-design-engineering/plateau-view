import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { styled } from '@mui/material'
import { useAtomValue } from 'jotai'
import {
  forwardRef,
  type ComponentPropsWithRef,
  type ComponentType
} from 'react'
import { mergeRefs } from 'react-merge-refs'

import { type LayerListItemProps } from './LayerList'

const Root = styled('div')({})

// TODO: Remove wrapper
interface LayerListItemWrapperProps
  extends ComponentPropsWithRef<typeof Root>,
    LayerListItemProps {
  ItemComponent: ComponentType<LayerListItemProps>
}

export const LayerListItem = forwardRef<
  HTMLDivElement,
  LayerListItemWrapperProps
>(({ layerAtom, ItemComponent, ...props }, forwardedRef) => {
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
})
