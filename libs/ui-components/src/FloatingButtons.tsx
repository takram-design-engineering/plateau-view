import { buttonClasses, Stack, styled } from '@mui/material'
import { forwardRef } from 'react'

import { FloatingPanel, type FloatingPanelProps } from './FloatingPanel'

const StyledFloatingPanel = styled(FloatingPanel)(({ theme }) => ({
  [`& .${buttonClasses.root}`]: {
    height: theme.spacing(6),
    minWidth: theme.spacing(6.5),
    padding: `0 ${theme.spacing(1.5)}`,
    transition: 'none',
    [`&.${buttonClasses.containedPrimary}`]: {
      color: theme.palette.getContrastText(theme.palette.primary.dark)
    }
  }
}))

export interface FloatingButtonsProps extends FloatingPanelProps {}

export const FloatingButtons = forwardRef<HTMLDivElement, FloatingButtonsProps>(
  ({ children, ...props }, ref) => (
    <StyledFloatingPanel ref={ref} {...props}>
      <Stack direction='row'>{children}</Stack>
    </StyledFloatingPanel>
  )
)
