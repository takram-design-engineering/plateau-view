import { Button, Fade } from '@mui/material'
import { useAtom, useAtomValue } from 'jotai'
import { useSnackbar, type SnackbarKey } from 'notistack'
import { useEffect, useRef, type FC } from 'react'

import { platformAtom } from '@takram/plateau-shared-states'
import { Shortcut } from '@takram/plateau-ui-components'

import { hideAppOverlayAtom } from '../states/app'

export const Notifications: FC = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const platform = useAtomValue(platformAtom)
  const platformRef = useRef(platform)
  platformRef.current = platform

  const [hideAppOverlay, setHideAppOverlay] = useAtom(hideAppOverlayAtom)
  const hideAppOverlayKeyRef = useRef<SnackbarKey>()

  useEffect(() => {
    if (hideAppOverlay) {
      hideAppOverlayKeyRef.current = enqueueSnackbar({
        message: (
          <>
            UIを再表示するには
            <Shortcut
              variant='outlined'
              platform={platformRef.current}
              shortcutKey='/'
              commandKey
              sx={{ marginX: 1 }}
            />
            を押します
          </>
        ),
        action: (
          <Button
            variant='text'
            onClick={() => {
              closeSnackbar(hideAppOverlayKeyRef.current)
            }}
          >
            閉じる
          </Button>
        ),
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center'
        },
        TransitionComponent: Fade
      })
    } else {
      closeSnackbar(hideAppOverlayKeyRef.current)
    }
  }, [enqueueSnackbar, closeSnackbar, hideAppOverlay, setHideAppOverlay])

  return null
}
