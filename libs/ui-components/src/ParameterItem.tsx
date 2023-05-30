import { ListItem, ListItemText, styled } from '@mui/material'
import { forwardRef, type ComponentPropsWithRef, type ReactNode } from 'react'

const Root = styled('div', {
  shouldForwardProp: prop => prop !== 'gutterBottom'
})<{ gutterBottom?: boolean }>(({ theme, gutterBottom = false }) => ({
  ...(gutterBottom && {
    marginBottom: theme.spacing(1)
  })
}))

export interface ParameterItemProps extends ComponentPropsWithRef<typeof Root> {
  label?: ReactNode
  description?: ReactNode
  control?: ReactNode
}

export const ParameterItem = forwardRef<HTMLDivElement, ParameterItemProps>(
  ({ label, description, control, children, ...props }, ref) => (
    <Root ref={ref} {...props}>
      <ListItem disableGutters secondaryAction={control}>
        {(label != null || description != null) && (
          <ListItemText primary={label} secondary={description} />
        )}
      </ListItem>
      {children}
    </Root>
  )
)
