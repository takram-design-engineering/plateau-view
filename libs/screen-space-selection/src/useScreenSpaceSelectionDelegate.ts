import { type BoundingSphere } from '@cesium/engine'
import { useAtomValue, useSetAtom } from 'jotai'
import { uniq, without } from 'lodash'
import { useContext, useEffect, useRef } from 'react'

import { useCesium } from '@plateau/cesium'

import { ScreenSpaceSelectionContext } from './ScreenSpaceSelectionContext'

export interface ScreenSpaceSelectionParams<T extends object> {
  predicate: (object: object) => object is T
  onSelect: (objects: readonly T[]) => void
  onDeselect: (objects: readonly T[]) => void
  computeBoundingSphere: (
    object: T,
    result?: BoundingSphere
  ) => BoundingSphere | undefined
}

export function useScreenSpaceSelectionDelegate<T extends object>({
  predicate,
  onSelect,
  onDeselect
}: ScreenSpaceSelectionParams<T>): void {
  const scene = useCesium(({ scene }) => scene, { indirect: true })
  const { selectEventAtom, deselectEventAtom } = useContext(
    ScreenSpaceSelectionContext
  )
  const predicateRef = useRef(predicate)
  predicateRef.current = predicate

  const selectionRef = useRef<object[]>([])

  const selectEvent = useAtomValue(selectEventAtom)
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect
  useEffect(() => {
    return selectEvent.addEventListener(objects => {
      const filteredObjects = objects.filter(predicateRef.current)
      if (filteredObjects.length > 0) {
        onSelectRef.current(filteredObjects)
        selectionRef.current = uniq([
          ...selectionRef.current,
          ...filteredObjects
        ])
        scene?.requestRender()
      }
    })
  }, [onSelect, scene, selectEvent])

  const deselectEvent = useAtomValue(deselectEventAtom)
  const onDeselectRef = useRef(onDeselect)
  onDeselectRef.current = onDeselect
  useEffect(() => {
    return deselectEvent.addEventListener(objects => {
      const filteredObjects = objects.filter(predicateRef.current)
      if (filteredObjects.length > 0) {
        onDeselectRef.current(filteredObjects)
        selectionRef.current = without(selectionRef.current, ...filteredObjects)
        scene?.requestRender()
      }
    })
  }, [onDeselect, scene, deselectEvent])

  // Assume that the component isn't reused.
  const { removeAtom } = useContext(ScreenSpaceSelectionContext)
  const remove = useSetAtom(removeAtom)
  useEffect(() => {
    return () => {
      // Deselect currently selected objects.
      if (selectionRef.current.length > 0) {
        remove(selectionRef.current)
      }
    }
  }, [remove])
}
