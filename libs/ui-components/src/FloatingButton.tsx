import { Button, styled, type ButtonProps } from '@mui/material'
import { forwardRef } from 'react'

import { FloatingPanel } from './FloatingPanel'

const StyledButton = styled(Button)(({ theme }) => ({
  height: theme.spacing(6),
  minWidth: theme.spacing(6.5),
  padding: `0 ${theme.spacing(1.5)}`,
  color: theme.palette.text.primary
}))

export interface FloatingButtonProps extends ButtonProps {}

export const FloatingButton = forwardRef<
  HTMLButtonElement,
  FloatingButtonProps
>((props, ref) => (
  <FloatingPanel>
    <StyledButton
      ref={ref}
      variant='text'
      size='small'
      color='primary'
      {...props}
    />
  </FloatingPanel>
))
