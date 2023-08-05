import { ListItem, listItemSecondaryActionClasses, styled } from '@mui/material'
import { forwardRef, type ComponentPropsWithRef, type ReactNode } from 'react'

import { ParameterItemText } from './ParameterItemText'

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
}>(
  ({
    theme,
    // @ts-expect-error Missing type
    ownerState,
    secondaryActionSpace = 'normal'
  }) => ({
    paddingLeft: theme.spacing(1),
    ...(ownerState?.hasSecondaryAction === true && {
      paddingRight: theme.spacing(1)
    }),
    ...(secondaryActionSpace === 'button' && {
      [`& .${listItemSecondaryActionClasses.root}`]: {
        right: 0
      }
    })
  })
)

const Children = styled('div')(({ theme }) => ({
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1)
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
      labelFontSize = 'medium',
      children,
      ...props
    },
    ref
  ) => (
    <Root ref={ref} {...props}>
      <StyledListItem
        secondaryAction={control}
        secondaryActionSpace={controlSpace}
      >
        {(label != null || description != null) && (
          <ParameterItemText
            primary={label}
            secondary={description}
            fontSize={labelFontSize}
          />
        )}
      </StyledListItem>
      {children != null && <Children>{children}</Children>}
    </Root>
  )
)
