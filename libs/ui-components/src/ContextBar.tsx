import { styled } from '@mui/material'
import { forwardRef, type ComponentPropsWithRef, type ReactNode } from 'react'

import { FloatingPanel } from './FloatingPanel'

const Root = styled(FloatingPanel, {
  shouldForwardProp: prop => prop !== 'hidden'
})<{
  hidden?: boolean
}>(({ hidden = false }) => ({
  minWidth: 0,
  ...(hidden && {
    visibility: 'hidden'
  })
}))

const RoundedBox = styled('div')(({ theme }) => ({
  ...theme.typography.body2,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: `0 ${theme.spacing(1)}`,
  height: theme.spacing(6),
  borderRadius: theme.shape.borderRadius
}))

export interface ContextBarProps extends ComponentPropsWithRef<typeof Root> {
  children?: ReactNode
}

export const ContextBar = forwardRef<HTMLDivElement, ContextBarProps>(
  ({ children, ...props }, ref) => (
    <Root ref={ref} {...props}>
      <RoundedBox>{children}</RoundedBox>
    </Root>
  )
)
