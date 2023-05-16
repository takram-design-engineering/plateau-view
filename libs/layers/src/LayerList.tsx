import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent
} from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { styled } from '@mui/material'
import { useAtomValue, useSetAtom, type PrimitiveAtom } from 'jotai'
import {
  forwardRef,
  useCallback,
  type ComponentPropsWithRef,
  type ComponentType
} from 'react'
import invariant from 'tiny-invariant'

import { LayerListItem } from './LayerListItem'
import { type AnyLayerModel } from './types'
import { useLayers } from './useLayers'

const Root = styled('div')({})

export interface LayerListItemProps {
  layerAtom: PrimitiveAtom<AnyLayerModel>
}

export interface LayerListProps extends ComponentPropsWithRef<typeof Root> {
  ItemComponent: ComponentType<LayerListItemProps>
  minimumDragDistance?: number
}

export const LayerList = forwardRef<HTMLDivElement, LayerListProps>(
  ({ minimumDragDistance = 5, ItemComponent, ...props }, ref) => {
    const sensors = useSensors(
      useSensor(PointerSensor, {
        activationConstraint: {
          distance: minimumDragDistance
        }
      }),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates
      })
    )

    const { layerIdsAtom, layerAtomsAtom, moveAtom } = useLayers()
    const layerAtoms = useAtomValue(layerAtomsAtom)
    const layerIds = useAtomValue(layerIdsAtom)
    const move = useSetAtom(moveAtom)

    const handleDragEnd = useCallback(
      (event: DragEndEvent) => {
        if (event.over == null || event.active.id === event.over.id) {
          return
        }
        invariant(typeof event.active.id === 'string')
        invariant(typeof event.over.id === 'string')
        move(event.active.id, event.over.id)
      },
      [move]
    )

    return (
      <Root ref={ref} {...props}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={layerIds}
            strategy={verticalListSortingStrategy}
          >
            {layerAtoms.map((layerAtom, index) => (
              // Technically key can be coerced string of atom, but dnd-kit
              // disagree with it.
              <LayerListItem
                key={layerIds[index]}
                layerAtom={layerAtom}
                ItemComponent={ItemComponent}
              />
            ))}
          </SortableContext>
        </DndContext>
      </Root>
    )
  }
)
