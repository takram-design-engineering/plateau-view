import { styled } from '@mui/material'
import { type ComponentPropsWithoutRef, type FC } from 'react'

const Root = styled('div', {
  shouldForwardProp: prop => prop !== 'disablePadding'
})<{
  disablePadding?: boolean
}>(({ theme, disablePadding = false }) => ({
  ...(!disablePadding && {
    padding: theme.spacing(1)
  })
}))

export interface InspectorItemProps
  extends ComponentPropsWithoutRef<typeof Root> {}

export const InspectorItem: FC<InspectorItemProps> = props => (
  <Root {...props} />
)
