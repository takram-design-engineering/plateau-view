import {
  ListItem,
  listItemSecondaryActionClasses,
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

const StyledListItem = styled(ListItem, {
  shouldForwardProp: prop => prop !== 'secondaryActionSpace'
})<{
  secondaryActionSpace?: 'normal' | 'button'
}>(({ theme, secondaryActionSpace = 'normal' }) => ({
  ...(secondaryActionSpace === 'button' && {
    [`& .${listItemSecondaryActionClasses.root}`]: {
      right: theme.spacing(-1)
    }
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
  controlSpace?: 'normal' | 'button'
  labelFontSize?: 'small' | 'medium'
}

export const ParameterItem = forwardRef<HTMLDivElement, ParameterItemProps>(
  (
    {
      label,
      description,
      control,
      controlSpace = 'normal',
      labelFontSize = 'small',
      children,
      ...props
    },
    ref
  ) => (
    <Root ref={ref} {...props}>
      <StyledListItem
        disableGutters
        secondaryAction={control}
        secondaryActionSpace={controlSpace}
      >
        {(label != null || description != null) && (
          <StyledListItemText
            primary={label}
            secondary={description}
            fontSize={labelFontSize}
          />
        )}
      </StyledListItem>
      {children}
    </Root>
  )
)
