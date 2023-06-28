import { Button, styled, Typography, type ButtonProps } from '@mui/material'
import { forwardRef } from 'react'

const Root = styled(Button)(({ theme }) => ({
  height: theme.spacing(5),
  color: theme.palette.text.primary
}))

export interface AppBreadcrumbsItemProps extends ButtonProps {}

export const AppBreadcrumbsItem = forwardRef<
  HTMLButtonElement,
  AppBreadcrumbsItemProps
>(({ children, ...props }, ref) => (
  <Root ref={ref} variant='text' {...props}>
    <Typography variant='body2'>{children}</Typography>
  </Root>
))
