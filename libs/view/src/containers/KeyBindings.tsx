import { useAtomValue, useSetAtom } from 'jotai'
import { type FC } from 'react'

import { useWindowEvent } from '@takram/plateau-react-helpers'
import { platformAtom } from '@takram/plateau-shared-states'
import { testShortcut } from '@takram/plateau-ui-components'

import { hideAppOverlayAtom, showDeveloperPanelsAtom } from '../states/app'
import { toolMachineAtom } from '../states/tool'

export const KeyBindings: FC = () => {
  const platform = useAtomValue(platformAtom)
  const setHideAppOverlay = useSetAtom(hideAppOverlayAtom)
  const setShowDeveloperPanels = useSetAtom(showDeveloperPanelsAtom)
  const send = useSetAtom(toolMachineAtom)

  useWindowEvent('keydown', event => {
    if (
      testShortcut(event, platform, {
        code: 'Slash',
        commandKey: true
      })
    ) {
      event.preventDefault()
      setHideAppOverlay(value => !value)
    }
    if (
      testShortcut(event, platform, {
        code: 'Backslash',
        commandKey: true
      })
    ) {
      event.preventDefault()
      setShowDeveloperPanels(value => !value)
    }

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
