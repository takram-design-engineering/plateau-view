import {
  ListItem,
  ListItemText,
  listItemTextClasses,
  styled
} from '@mui/material'
import { forwardRef, type ComponentPropsWithRef, type ReactNode } from 'react'

const Root = styled('div', {
  shouldForwardProp: prop => prop !== 'gutterBottom'
})<{ gutterBottom?: boolean }>(({ theme, gutterBottom = false }) => ({
  ...(gutterBottom && {
    marginBottom: theme.spacing(1)
  })
}))

const StyledListItemText = styled(ListItemText, {
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

export interface ParameterItemProps extends ComponentPropsWithRef<typeof Root> {
  label?: ReactNode
  description?: ReactNode
  control?: ReactNode
  labelFontSize?: 'small' | 'medium'
}

export const ParameterItem = forwardRef<HTMLDivElement, ParameterItemProps>(
  (
    {
      label,
      description,
      control,
      labelFontSize = 'small',
      children,
      ...props
    },
    ref
  ) => (
    <Root ref={ref} {...props}>
      <ListItem disableGutters secondaryAction={control}>
        {(label != null || description != null) && (
          <StyledListItemText
            primary={label}
            secondary={description}
            fontSize={labelFontSize}
          />
        )}
      </ListItem>
      {children}
    </Root>
  )
)
