import { Button, styled, type ButtonProps } from '@mui/material'
import { forwardRef } from 'react'

const Root = styled(Button, {
  shouldForwardProp: prop => prop !== 'selected'
})<{
  selected: boolean
}>(({ theme, selected }) => ({
  ...theme.typography.body2,
  height: theme.spacing(5),
  fontWeight: 500,
  transition: theme.transitions.create('background-color', {
    duration: theme.transitions.duration.short
  }),
  ...(selected
    ? { color: theme.palette.text.primary }
    : { color: theme.palette.text.secondary })
}))

export interface AppBreadcrumbsItemProps extends ButtonProps {
  selected?: boolean
}

export const AppBreadcrumbsItem = forwardRef<
  HTMLButtonElement,
  AppBreadcrumbsItemProps
>(({ selected = false, children, ...props }, ref) => (
  <Root ref={ref} variant='text' {...props} selected={selected}>
    {children}
  </Root>
))
