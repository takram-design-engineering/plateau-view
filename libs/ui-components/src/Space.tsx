import { styled } from '@mui/material'
import { type ComponentPropsWithRef } from 'react'

export const Space = styled('div', {
  shouldForwardProp: prop => prop !== 'flexible' && prop !== 'size'
})<{
  flexible?: boolean
  size?: number
}>(({ theme, flexible = false, size = 1 }) => ({
  ...(flexible
    ? {
        flexGrow: 1,
        flexShrink: 1
      }
    : {
        flexGrow: 0,
        flexShrink: 0
      }),
  flexBasis: theme.spacing(size)
}))

export interface SpaceProps extends ComponentPropsWithRef<typeof Space> {}
