import { ListItemButton, Stack, styled } from '@mui/material'
import { forwardRef, type ComponentPropsWithRef, type ReactNode } from 'react'

import { ParameterItemText } from './ParameterItemText'

const Root = styled('div', {
  shouldForwardProp: prop => prop !== 'gutterBottom'
})<{ gutterBottom?: boolean }>(({ theme, gutterBottom = false }) => ({
  ...(gutterBottom && {
    marginBottom: theme.spacing(1)
  })
}))

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  display: 'block',
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
  borderRadius: theme.shape.borderRadius
}))

const Icon = styled('div')(({ theme }) => ({
  display: 'flex',
  color: theme.palette.action.active
}))

export interface ParameterItemButtonProps
  extends ComponentPropsWithRef<typeof Root> {
  label?: ReactNode
  description?: ReactNode
  labelFontSize?: 'small' | 'medium'
  icon?: ReactNode
}

export const ParameterItemButton = forwardRef<
  HTMLDivElement,
  ParameterItemButtonProps
>(
  (
    { label, description, labelFontSize = 'medium', icon, children, ...props },
    ref
  ) => (
    <Root ref={ref} {...props}>
      <StyledListItemButton>
        <Stack
          direction='row'
          spacing={1}
          alignItems='center'
          justifyContent='space-between'
        >
          {(label != null || description != null) && (
            <ParameterItemText
              primary={label}
              secondary={description}
              fontSize={labelFontSize}
            />
          )}
          {icon != null && <Icon>{icon}</Icon>}
        </Stack>
        {children}
      </StyledListItemButton>
    </Root>
  )
)
