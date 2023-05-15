import { useSetAtom } from 'jotai'
import { useContext, useEffect, useRef } from 'react'

import { useCesium } from '@plateau/cesium'
import { useConstant } from '@plateau/react-helpers'

import {
  ScreenSpaceSelectionContext,
  type ScreenSpaceSelectionResponder
} from './ScreenSpaceSelectionContext'

export interface ScreenSpaceSelectionResponderParams<T extends object>
  extends ScreenSpaceSelectionResponder<T> {}

export function useScreenSpaceSelectionResponder<T extends object>(
  params: ScreenSpaceSelectionResponder<T>
): ReadonlySet<T> {
  const scene = useCesium(({ scene }) => scene, { indirect: true })
  const selection = useConstant(() => new Set<T>())

  const paramsRef = useRef(params)
  paramsRef.current = params

  const responder = useConstant<ScreenSpaceSelectionResponder<T>>(() => ({
    predicate: (object): object is T => {
      return paramsRef.current.predicate(object)
    },
    onSelect: objects => {
      paramsRef.current.onSelect(objects)
      objects.forEach(object => {
        selection.add(object)
      })
      scene?.requestRender()
    },
    onDeselect: objects => {
      paramsRef.current.onDeselect(objects)
      objects.forEach(object => {
        selection.delete(object)
      })
      scene?.requestRender()
    },
    computeBoundingSphere: (object, result) => {
      return paramsRef.current.computeBoundingSphere?.(object, result)
    }
  }))

  const { becomeResponder, removeAtom } = useContext(
    ScreenSpaceSelectionContext
  )
  const remove = useSetAtom(removeAtom)

  // Assume that the component isn't reused.
  useEffect(() => {
    const resignResponder = becomeResponder(responder)
    return () => {
      if (selection.size > 0) {
        remove(Array.from(selection.values()))
      }
      resignResponder()
    }
  }, [selection, responder, becomeResponder, remove])

  return selection
}
