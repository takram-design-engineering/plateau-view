import { ScreenSpaceEventType } from '@cesium/engine'
import { useSetAtom } from 'jotai'
import { useContext } from 'react'

import {
  useScreenSpaceEvent,
  useScreenSpaceEventHandler
} from '@takram/plateau-cesium'
import { useWindowEvent } from '@takram/plateau-react-helpers'

import { SketchContext } from './SketchProvider'

export function useSendStateMachineEvents(): void {
  const { stateAtom } = useContext(SketchContext)
  const send = useSetAtom(stateAtom)

  useWindowEvent('keypress', event => {
    if (event.key === ' ' && !event.repeat) {
      send({ type: 'PRESS_SPACE' })
    }
  })
  useWindowEvent('keyup', event => {
    if (event.key === ' ') {
      send({ type: 'RELEASE_SPACE' })
    }
  })

  const eventHandler = useScreenSpaceEventHandler()
  useScreenSpaceEvent(eventHandler, ScreenSpaceEventType.LEFT_DOWN, () => {
    send({ type: 'MOUSE_DOWN' })
  })
  useScreenSpaceEvent(eventHandler, ScreenSpaceEventType.LEFT_UP, () => {
    send({ type: 'MOUSE_UP' })
  })
}
