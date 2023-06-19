import FlightTakeoffOutlinedIcon from '@mui/icons-material/FlightTakeoffOutlined'
import { useAtom, type PrimitiveAtom } from 'jotai'
import { useCallback, type FC } from 'react'

import {
  FloatingButtonItem,
  FloatingButtons,
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

export const CameraToolbar: FC = () => {
  const enableKeyboardCameraControlProps = useBooleanAtomProps(
    enableKeyboardCameraControlAtom
  )
  return (
    <FloatingButtons>
      {process.env.NODE_ENV !== 'production' && (
        <FloatingButtonItem title='飛行' {...enableKeyboardCameraControlProps}>
          <FlightTakeoffOutlinedIcon fontSize='medium' />
        </FloatingButtonItem>
      )}
      <FloatingButtonItem title='自動回転' disabled>
        <RotateAroundIcon fontSize='medium' />
      </FloatingButtonItem>
      <FloatingButtonItem title='縮小' disabled>
        <MinusIcon fontSize='medium' />
      </FloatingButtonItem>
      <FloatingButtonItem title='拡大' disabled>
        <PlusIcon fontSize='medium' />
      </FloatingButtonItem>
    </FloatingButtons>
  )
}
