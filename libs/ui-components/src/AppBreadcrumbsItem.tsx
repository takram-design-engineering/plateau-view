import { Button, buttonClasses, styled, type ButtonProps } from '@mui/material'
import { forwardRef } from 'react'

import { DropDownIcon } from './icons'

const Root = styled(Button)(({ theme }) => ({
  ...theme.typography.body2,
  position: 'relative',
  height: theme.spacing(5),
  fontWeight: 500,
  transition: theme.transitions.create('background-color', {
    duration: theme.transitions.duration.short
  }),
  color: theme.palette.text.primary,
  [`&.${buttonClasses.disabled}`]: {
    color: theme.palette.text.secondary
  }
}))

const DropDown = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  color: theme.palette.text.secondary,
  fontSize: 20,
  transform: `translate(-50%, calc(50% - ${theme.spacing(1.5)}))`
}))

export interface AppBreadcrumbsItemProps extends ButtonProps {
  dropDown?: boolean
}

export const AppBreadcrumbsItem = forwardRef<
  HTMLButtonElement,
  AppBreadcrumbsItemProps
>(({ dropDown = false, children, ...props }, ref) => (
  <Root ref={ref} variant='text' {...props}>
    {children}
    {dropDown && (
      <DropDown>
        <DropDownIcon fontSize='inherit' />
      </DropDown>
    )}
  </Root>
))
