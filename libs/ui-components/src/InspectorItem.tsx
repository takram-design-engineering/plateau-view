import { Stack, styled } from '@mui/material'
import { type FC, type ReactNode } from 'react'

const Root = styled('div')(({ theme }) => ({
  padding: `${theme.spacing(1)} ${theme.spacing(2)}`
}))

export interface InspectorItemProps {
  children?: ReactNode
}

export const InspectorItem: FC<InspectorItemProps> = ({ children }) => (
  <Root>{children}</Root>
)
