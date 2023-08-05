import { ListItemText, listItemTextClasses, styled } from '@mui/material'
import { type ComponentPropsWithRef } from 'react'

export const ParameterItemText = styled(ListItemText, {
  shouldForwardProp: prop => prop !== 'fontSize'
})<{
  fontSize?: 'small' | 'medium'
}>(({ theme, fontSize = 'small' }) => ({
  [`& .${listItemTextClasses.primary}`]: {
    ...(fontSize === 'medium' ? theme.typography.body1 : theme.typography.body2)
  },
  [`& .${listItemTextClasses.secondary}`]: {
    ...theme.typography.caption
  },
  [`& .${listItemTextClasses.primary} + .${listItemTextClasses.secondary}`]: {
    marginTop: theme.spacing(0.5)
  }
}))

export type ParameterItemTextProps = ComponentPropsWithRef<
  typeof ParameterItemText
>
