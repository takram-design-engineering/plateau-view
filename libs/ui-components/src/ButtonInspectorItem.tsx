import { Button, styled, type ButtonProps } from '@mui/material'
import { forwardRef, type PropsWithoutRef } from 'react'

import { ParameterItem, type ParameterItemProps } from './ParameterItem'

const StyledButton = styled(Button)({})

export interface ButtonParameterItemProps
  extends PropsWithoutRef<Omit<ButtonProps, 'value'>>,
    Pick<ParameterItemProps, 'label' | 'labelFontSize' | 'description'> {}

export const ButtonParameterItem = forwardRef<
  HTMLDivElement,
  ButtonParameterItemProps
>(({ label, labelFontSize, description, ...props }, ref) => {
  return (
    <ParameterItem
      ref={ref}
      label={label}
      labelFontSize={labelFontSize}
      description={description}
      gutterBottom
    >
      <StyledButton size='small' variant='outlined' fullWidth {...props} />
    </ParameterItem>
  )
})
