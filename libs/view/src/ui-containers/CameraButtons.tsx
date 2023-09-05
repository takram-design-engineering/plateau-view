import { Cartesian3 } from '@cesium/engine'
import { Button, CircularProgress, Fade } from '@mui/material'
import { useAtom, type PrimitiveAtom } from 'jotai'
import { useSnackbar } from 'notistack'
import { useCallback, useEffect, useState, type FC } from 'react'

import { useCesium } from '@takram/plateau-cesium'
import {
  flyToDestination,
  getCameraEllipsoidIntersection
} from '@takram/plateau-cesium-helpers'
import {
  AppIconButton,
  KeyboardMovementIcon,
  LocationIcon,
  MinusIcon,
  PlusIcon,
  RotateAroundIcon
} from '@takram/plateau-ui-components'

import { useCameraZoom } from '../hooks/useCameraZoom'
import {
  autoRotateCameraAtom,
  enableKeyboardCameraControlAtom
} from '../states/app'

function useBooleanAtomProps(atom: PrimitiveAtom<boolean>): {
  selected: boolean
  onClick: () => void
} {
  const [selected, setSelected] = useAtom(atom)
  const handleClick = useCallback(() => {
    setSelected(value => !value)
  }, [setSelected])
  return { selected, onClick: handleClick }
}

const GeolocationButton: FC = () => {
  const scene = useCesium(({ scene }) => scene, { indirect: true })
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const [enabled, setEnabled] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setEnabled('geolocation' in navigator)
  }, [])

  const handleClick = useCallback(() => {
    if (scene == null) {
      return
    }
    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLoading(false)
        const target = Cartesian3.fromDegrees(
          coords.longitude,
          coords.latitude,
          undefined,
          scene.globe.ellipsoid
        )
        const cartesian = new Cartesian3()
        const offset = Cartesian3.subtract(
          scene.camera.position,
          getCameraEllipsoidIntersection(scene),
          cartesian
        )
        const position = Cartesian3.add(target, offset, cartesian)
        flyToDestination(scene, position).catch(error => {
          console.error(error)
        })
      },
      () => {
        setLoading(false)
        const snackbar = enqueueSnackbar({
          variant: 'error',
          message: '現在地を取得できませんでした',
          action: (
            <Button
              variant='text'
              onClick={() => {
                closeSnackbar(snackbar)
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
      }
    )
  }, [scene, enqueueSnackbar, closeSnackbar])

  return (
    <AppIconButton
      title='現在地'
      disabled={!enabled || scene == null || loading}
      onClick={handleClick}
    >
      {loading ? <CircularProgress size={21} /> : <LocationIcon />}
    </AppIconButton>
  )
}

export const CameraButtons: FC = () => {
  const enableKeyboardCameraControlProps = useBooleanAtomProps(
    enableKeyboardCameraControlAtom
  )
  const autoRotateCameraProps = useBooleanAtomProps(autoRotateCameraAtom)
  const { zoomIn, zoomOut } = useCameraZoom()
  return (
    <>
      <AppIconButton
        title='キーボード操作'
        {...enableKeyboardCameraControlProps}
      >
        <KeyboardMovementIcon />
      </AppIconButton>
      <GeolocationButton />
      <AppIconButton title='自動回転' {...autoRotateCameraProps}>
        <RotateAroundIcon />
      </AppIconButton>
      <AppIconButton title='縮小' onClick={zoomOut}>
        <MinusIcon />
      </AppIconButton>
      <AppIconButton title='拡大' onClick={zoomIn}>
        <PlusIcon />
      </AppIconButton>
    </>
  )
}
