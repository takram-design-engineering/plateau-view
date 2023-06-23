import { Button, buttonClasses, styled, type ButtonProps } from '@mui/material'
import { forwardRef } from 'react'

import { FloatingPanel } from './FloatingPanel'

const StyledButton = styled(Button)(({ theme }) => ({
  height: theme.spacing(6),
  minWidth: theme.spacing(6),
  padding: `0 ${theme.spacing(1.5)}`,
  transition: 'none',
  [`&.${buttonClasses.containedPrimary}`]: {
    color: theme.palette.getContrastText(theme.palette.primary.dark)
  }
}))

export interface FloatingButtonProps extends ButtonProps {
  selected?: boolean
}

export const FloatingButton = forwardRef<
  HTMLButtonElement,
  FloatingButtonProps
>(({ selected = false, ...props }, ref) => (
  <FloatingPanel>
    <StyledButton
      ref={ref}
      variant='text'
      size='small'
      color={selected ? 'primary' : 'inherit'}
      {...props}
    />
  </FloatingPanel>
))
