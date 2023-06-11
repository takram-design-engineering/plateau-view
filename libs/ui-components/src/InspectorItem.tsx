import { styled } from '@mui/material'
import { type FC, type ReactNode } from 'react'

const Root = styled('div', {
  shouldForwardProp: prop => prop !== 'disablePadding'
})<{
  disablePadding?: boolean
}>(({ theme, disablePadding = false }) => ({
  ...(!disablePadding && {
    padding: `${theme.spacing(1)} ${theme.spacing(2)}`
  })
}))

export interface InspectorItemProps {
  disablePadding?: boolean
  children?: ReactNode
}

export const InspectorItem: FC<InspectorItemProps> = ({
  disablePadding = false,
  children
}) => <Root disablePadding={disablePadding}>{children}</Root>
