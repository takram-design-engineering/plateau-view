import { Color } from '@cesium/engine'
import { useTheme } from '@mui/material'
import { useAtomValue } from 'jotai'
import { useMemo, type FC } from 'react'

import { ScreenSpaceSelectionBoundingSphere } from '@takram/plateau-screen-space-selection'

import { showSelectionBoundingSphereAtom } from '../states/app'

export const SelectionBoundingSphere: FC = () => {
  const show = useAtomValue(showSelectionBoundingSphereAtom)
  const theme = useTheme()
  const color = useMemo(
    () => Color.fromCssColorString(theme.palette.primary.main),
    [theme]
  )
  return show ? <ScreenSpaceSelectionBoundingSphere color={color} /> : null
}
