import { useAtomValue, useSetAtom } from 'jotai'
import { type FC } from 'react'

import {
  streetViewAtom,
  streetViewVisibleAtom
} from '@takram/plateau-pedestrian'
import { useWindowEvent } from '@takram/plateau-react-helpers'
import { platformAtom } from '@takram/plateau-shared-states'
import { testShortcut } from '@takram/plateau-ui-components'

import { useCameraZoom } from '../hooks/useCameraZoom'
import { hideAppOverlayAtom, showDeveloperPanelsAtom } from '../states/app'
import { toolMachineAtom } from '../states/tool'

export const KeyBindings: FC = () => {
  const platform = useAtomValue(platformAtom)
  const setHideAppOverlay = useSetAtom(hideAppOverlayAtom)
  const setShowDeveloperPanels = useSetAtom(showDeveloperPanelsAtom)
  const send = useSetAtom(toolMachineAtom)

  const streetViewVisible = useAtomValue(streetViewVisibleAtom)
  const streetView = useAtomValue(streetViewAtom)

  const { zoomIn, zoomOut } = useCameraZoom()

  useWindowEvent('keydown', event => {
    if (
      testShortcut(event, platform, {
        code: 'Slash',
        commandKey: true
      })
    ) {
      event.preventDefault()
      setHideAppOverlay(value => !value)
      return
    }
    if (
      testShortcut(event, platform, {
        code: 'Backslash',
        commandKey: true
      })
    ) {
      event.preventDefault()
      setShowDeveloperPanels(value => !value)
      return
    }

    if (document.activeElement !== document.body) {
      return
    }

    if (event.altKey || event.metaKey || event.ctrlKey) {
      return
    }
    if (!event.repeat) {
      if (event.key === '+' || event.code === 'Plus') {
        event.preventDefault()
        if (streetViewVisible && streetView != null) {
          streetView.panorama.focus()
        } else {
          zoomIn()
        }
        return
      }
      if (event.key === '-' || event.code === 'Minus') {
        event.preventDefault()
        if (streetViewVisible && streetView != null) {
          streetView.panorama.focus()
        } else {
          zoomOut()
        }
        return
      }
    }
    if (event.shiftKey) {
      return
    }
    if (!event.repeat) {
      switch (event.key) {
        case 'v':
          event.preventDefault()
          send({ type: 'SELECT' })
          return
        case 'h':
          event.preventDefault()
          send({ type: 'HAND' })
          return
        case 'g':
          event.preventDefault()
          send({ type: 'SKETCH' })
          return
        case 't':
          event.preventDefault()
          send({ type: 'STORY' })
          return
        case 'p':
          event.preventDefault()
          send({ type: 'PEDESTRIAN' })
          return
      }
      if (
        streetViewVisible &&
        streetView != null &&
        (event.key === 'w' ||
          event.key === 'a' ||
          event.key === 's' ||
          event.key === 'd' ||
          event.code === 'ArrowUp' ||
          event.code === 'ArrowDown' ||
          event.code === 'ArrowLeft' ||
          event.code === 'ArrowRight')
      ) {
        event.preventDefault()
        // TODO: This misses the first key input.
        streetView.panorama.focus()
      }
    }
  })

  return null
}
