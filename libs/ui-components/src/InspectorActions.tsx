import { Stack, styled } from '@mui/material'
import { type FC, type ReactNode } from 'react'

const Root = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(0.5)
}))

export interface InspectorActionsProps {
  children?: ReactNode
}

export const InspectorActions: FC<InspectorActionsProps> = ({ children }) => (
  <Root direction='row' justifyContent='space-evenly'>
    {children}
  </Root>
)
