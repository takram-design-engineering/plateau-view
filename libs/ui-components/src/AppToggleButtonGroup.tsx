import {
  styled,
  ToggleButtonGroup,
  type ToggleButtonGroupProps
} from '@mui/material'
import { forwardRef } from 'react'

const Root = styled(ToggleButtonGroup)(({ theme }) => ({
  overflow: 'hidden',
  flexShrink: 0,
  height: theme.spacing(5)
}))

export interface AppToggleButtonGroupProps extends ToggleButtonGroupProps {}

export const AppToggleButtonGroup = forwardRef<
  HTMLDivElement,
  AppToggleButtonGroupProps
>((props, ref) => <Root ref={ref} exclusive {...props} />)
