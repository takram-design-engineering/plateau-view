import { Cartesian3 } from '@cesium/engine'
import { Button, CircularProgress, Fade } from '@mui/material'
import { useSnackbar } from 'notistack'
import { useCallback, useEffect, useState, type FC } from 'react'

import { useCesium } from '@takram/plateau-cesium'
import {
  flyToDestination,
  getCameraEllipsoidIntersection
} from '@takram/plateau-cesium-helpers'
import { AppIconButton, LocationIcon } from '@takram/plateau-ui-components'

export const GeolocationButton: FC = () => {
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
