import {
  ToggleButtonGroup,
  darken,
  styled,
  toggleButtonClasses,
  type ToggleButtonGroupProps
} from '@mui/material'
import { forwardRef, type ComponentPropsWithRef, type ReactNode } from 'react'

import { FloatingPanel } from './FloatingPanel'

const Root = styled(FloatingPanel)({
  width: 'fit-content'
})

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  height: theme.spacing(6),
  [`& .${toggleButtonClasses.root}`]: {
    minWidth: theme.spacing(6.5),
    padding: `0 ${theme.spacing(1.5)}`,
    color: theme.palette.text.primary,
    // Add specificity
    [`&.${toggleButtonClasses.root}`]: {
      margin: 0,
      border: 0
    },
    [`&.${toggleButtonClasses.selected}`]: {
      color: theme.palette.getContrastText(theme.palette.primary.dark),
      backgroundColor: theme.palette.primary.main,
      '&:hover': {
        backgroundColor: darken(
          theme.palette.primary.main,
          theme.palette.action.hoverOpacity
        ),
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: theme.palette.primary.main
        }
      }
    }
  }
}))

export interface FloatingToolbarProps
  extends Omit<ComponentPropsWithRef<typeof Root>, 'onChange'>,
    Pick<ToggleButtonGroupProps, 'value' | 'onChange'> {
  children?: ReactNode
}

export const FloatingToolbar = forwardRef<HTMLDivElement, FloatingToolbarProps>(
  ({ value, onChange, children, ...props }, ref) => (
    <Root ref={ref} {...props}>
      <StyledToggleButtonGroup
        size='small'
        color='primary'
        exclusive
        value={value}
        onChange={onChange}
      >
        {children}
      </StyledToggleButtonGroup>
    </Root>
  )
)
