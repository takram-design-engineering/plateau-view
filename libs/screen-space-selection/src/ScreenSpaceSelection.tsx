import { Cartesian2 } from '@cesium/engine'
import { useSetAtom } from 'jotai'
import { useEffect, useMemo, type FC } from 'react'

import { useCesium } from '@takram/plateau-cesium'
import { assignPropertyProps } from '@takram/plateau-react-helpers'

import { Marquee } from './Marquee'
import { pickMany } from './pickMany'
import { ScreenSpaceSelectionHandler } from './ScreenSpaceSelectionHandler'
import {
  addScreenSpaceSelectionObjectsAtom,
  removeScreenSpaceSelectionObjectsAtom,
  replaceScreenSpaceSelectionObjectsAtom,
  screenSpaceSelectionHandlerAtom
} from './states'

const defaultOptions = {
  disabled: false
}

type ScreenSpaceSelectionOptions = Partial<typeof defaultOptions>

const pointScratch = new Cartesian2()

export interface ScreenSpaceSelectionProps
  extends ScreenSpaceSelectionOptions {}

export const ScreenSpaceSelection: FC<ScreenSpaceSelectionProps> = ({
  ...options
}) => {
  const scene = useCesium(({ scene }) => scene, { indirect: true })
  const handler = useMemo(
    () => (scene != null ? new ScreenSpaceSelectionHandler(scene) : undefined),
    [scene]
  )

  if (handler != null) {
    assignPropertyProps(handler, options, defaultOptions)
  }

  const setHandler = useSetAtom(screenSpaceSelectionHandlerAtom)
  useEffect(() => {
    setHandler(handler ?? null)
  }, [handler, setHandler])

  const replace = useSetAtom(replaceScreenSpaceSelectionObjectsAtom)
  const add = useSetAtom(addScreenSpaceSelectionObjectsAtom)
  const remove = useSetAtom(removeScreenSpaceSelectionObjectsAtom)

  useEffect(() => {
    return handler?.change.addEventListener(event => {
      if (scene == null) {
        return
      }
      let objects: object[] = []
      switch (event.type) {
        case 'point': {
          const object = scene.pick(event.position)
          if (object != null) {
            objects = [object]
          }
          break
        }
        case 'rectangle': {
          const { x, y, width, height } = event.rectangle
          if (width > 0 && height > 0) {
            pointScratch.x = x + width / 2
            pointScratch.y = y + height / 2
            objects = pickMany(scene, pointScratch, width, height)
          }
          break
        }
      }
      ;({ replace, add, remove })[event.action](objects)
    })
  }, [scene, handler, replace, add, remove])

  return <Marquee />
}
