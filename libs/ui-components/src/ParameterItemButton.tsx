import {
  ListItemButton,
  ListItemSecondaryAction,
  listItemSecondaryActionClasses,
  Stack,
  styled
} from '@mui/material'
import { forwardRef, type ComponentPropsWithRef, type ReactNode } from 'react'

import { ParameterItemText } from './ParameterItemText'

const Root = styled('div', {
  shouldForwardProp: prop => prop !== 'gutterBottom'
})<{ gutterBottom?: boolean }>(({ theme, gutterBottom = false }) => ({
  ...(gutterBottom && {
    marginBottom: theme.spacing(1)
  })
}))

const StyledListItemButton = styled(ListItemButton, {
  shouldForwardProp: prop =>
    prop !== 'hasSecondaryAction' && prop !== 'secondaryActionSpace'
})<{
  hasSecondaryAction?: boolean
  secondaryActionSpace?: 'normal' | 'button'
}>(
  ({ theme, hasSecondaryAction = false, secondaryActionSpace = 'normal' }) => ({
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    ...(hasSecondaryAction && {
      paddingRight: theme.spacing(1)
    }),
    [`& .${listItemSecondaryActionClasses.root}`]: {
      right: secondaryActionSpace === 'normal' ? theme.spacing(1) : 0
    }
  })
)

const Icon = styled('div')(({ theme }) => ({
  display: 'flex',
  color: theme.palette.action.active
}))

export interface ParameterItemButtonProps
  extends ComponentPropsWithRef<typeof Root> {
  label?: ReactNode
  description?: ReactNode
  control?: ReactNode
  controlSpace?: 'normal' | 'button'
  labelFontSize?: 'small' | 'medium'
  icon?: ReactNode
}

export const ParameterItemButton = forwardRef<
  HTMLDivElement,
  ParameterItemButtonProps
>(
  (
    {
      label,
      description,
      control,
      controlSpace = 'normal',
      labelFontSize = 'medium',
      icon,
      children,
      ...props
    },
    ref
  ) => (
    <Root ref={ref} {...props}>
      <StyledListItemButton
        hasSecondaryAction={control != null}
        secondaryActionSpace={controlSpace}
      >
        <Stack
          direction='row'
          spacing={1}
          width='100%'
          alignItems='center'
          justifyContent='space-between'
        >
          {(label != null || description != null) && (
            <div>
              <ParameterItemText
                primary={label}
                secondary={description}
                fontSize={labelFontSize}
              />
            </div>
          )}
          {icon != null && <Icon>{icon}</Icon>}
          {control != null && (
            <ListItemSecondaryAction>{control}</ListItemSecondaryAction>
          )}
        </Stack>
        {children}
      </StyledListItemButton>
    </Root>
  )
)
