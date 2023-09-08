import { useAtomValue } from 'jotai'
import { type FC } from 'react'

import {
  ScreenSpaceSelection as PlateauScreenSpaceSelection,
  type ScreenSpaceSelectionProps as PlateauScreenSpaceSelectionProps
} from '@takram/plateau-screen-space-selection'

import { toolAtom } from '../states/tool'
import { useMediaQuery, useTheme } from '@mui/material'

export interface ScreenSpaceSelectionProps
  extends Omit<PlateauScreenSpaceSelectionProps, 'disabled'> {}

export const ScreenSpaceSelection: FC<ScreenSpaceSelectionProps> = props => {
  const tool = useAtomValue(toolAtom)
  const theme = useTheme()
  const smDown = useMediaQuery(theme.breakpoints.down('sm'))
  return (
    <PlateauScreenSpaceSelection
      {...props}
      disabled={tool?.type !== 'select'}
      allowClickWhenDisabled={smDown}
    />
  )
}
