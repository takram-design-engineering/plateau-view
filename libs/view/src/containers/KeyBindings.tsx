import { useSetAtom } from 'jotai'
import { type FC } from 'react'

import { useWindowEvent } from '@takram/plateau-react-helpers'

import { toolMachineAtom } from '../states/tool'

export const KeyBindings: FC = () => {
  const send = useSetAtom(toolMachineAtom)
  useWindowEvent('keydown', event => {
    if (document.activeElement !== document.body) {
      return
    }
    if (event.altKey || event.shiftKey || event.metaKey || event.ctrlKey) {
      return
    }
    switch (event.key) {
      case 'v':
        send({ type: 'SELECT' })
        break
      case 'h':
        send({ type: 'HAND' })
        break
      case 'g':
        send({ type: 'SKETCH' })
        break
      case 't':
        send({ type: 'STORY' })
        break
      case 'p':
        send({ type: 'PEDESTRIAN' })
        break
    }
  })
  return null
}
