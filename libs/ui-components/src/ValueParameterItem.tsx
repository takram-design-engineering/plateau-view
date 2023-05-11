import { styled } from '@mui/material'
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode
} from 'react'

import { ParameterItem } from './ParameterItem'

const Value = styled('span')(({ theme }) => ({
  ...theme.typography.body2,
  fontVariantNumeric: 'tabular-nums'
}))

export interface ValueParameterItemProps
  extends Omit<ComponentPropsWithoutRef<typeof Value>, 'children'> {
  label?: ReactNode
  description?: ReactNode
  value: ReactNode
}

export const ValueParameterItem = forwardRef<
  HTMLDivElement,
  ValueParameterItemProps
>(({ label, description, value, onChange, ...props }, ref) => (
  <ParameterItem
    ref={ref}
    label={label}
    description={description}
    control={<Value {...props}>{value}</Value>}
  />
))
