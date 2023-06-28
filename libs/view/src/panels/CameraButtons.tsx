import FlightTakeoffOutlinedIcon from '@mui/icons-material/FlightTakeoffOutlined'
import { useAtom, type PrimitiveAtom } from 'jotai'
import { useCallback, type FC } from 'react'

import {
  AppIconButton,
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
  return (
    <>
      {process.env.NODE_ENV !== 'production' && (
        <AppIconButton
          title='キーボード操作'
          {...enableKeyboardCameraControlProps}
        >
          <FlightTakeoffOutlinedIcon fontSize='medium' />
        </AppIconButton>
      )}
      <AppIconButton title='自動回転' disabled>
        <RotateAroundIcon fontSize='medium' />
      </AppIconButton>
      <AppIconButton title='縮小' disabled>
        <MinusIcon fontSize='medium' />
      </AppIconButton>
      <AppIconButton title='拡大' disabled>
        <PlusIcon fontSize='medium' />
      </AppIconButton>
    </>
  )
}
