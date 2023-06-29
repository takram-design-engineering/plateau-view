import { useAtom, type PrimitiveAtom } from 'jotai'
import { useCallback, useRef, type FC } from 'react'

import { useCesium } from '@takram/plateau-cesium'
import { animateZoom } from '@takram/plateau-cesium-helpers'
import {
  AppIconButton,
  KeyboardIcon,
  LocationIcon,
  MinusIcon,
  PlusIcon,
  RotateAroundIcon
} from '@takram/plateau-ui-components'

import { enableKeyboardCameraControlAtom } from '../states/app'

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

export const CameraButtons: FC = () => {
  const enableKeyboardCameraControlProps = useBooleanAtomProps(
    enableKeyboardCameraControlAtom
  )

  const scene = useCesium(({ scene }) => scene)

  const zoomPromise = useRef(Promise.resolve())
  const handleZoomOut = useCallback(() => {
    zoomPromise.current = zoomPromise.current.then(async () => {
      await animateZoom(scene, -1)
    })
  }, [scene])

  const handleZoomIn = useCallback(() => {
    zoomPromise.current = zoomPromise.current.then(async () => {
      await animateZoom(scene, 1 / 2)
    })
  }, [scene])

  return (
    <>
      <AppIconButton
        title='キーボード操作'
        {...enableKeyboardCameraControlProps}
      >
        <KeyboardIcon />
      </AppIconButton>
      <AppIconButton title='現在地' disabled>
        <LocationIcon />
      </AppIconButton>
      <AppIconButton title='自動回転' disabled>
        <RotateAroundIcon />
      </AppIconButton>
      <AppIconButton title='縮小' onClick={handleZoomOut}>
        <MinusIcon />
      </AppIconButton>
      <AppIconButton title='拡大' onClick={handleZoomIn}>
        <PlusIcon />
      </AppIconButton>
    </>
  )
}
