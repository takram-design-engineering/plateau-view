import { useAtom, type PrimitiveAtom } from 'jotai'
import { useCallback, type FC } from 'react'

import {
  AppIconButton,
  KeyboardMovementIcon,
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
