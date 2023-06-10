import { styled } from '@mui/material'
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode
} from 'react'

import { ParameterItem, type ParameterItemProps } from './ParameterItem'

const Value = styled('span')(({ theme }) => ({
  ...theme.typography.body2,
  fontVariantNumeric: 'tabular-nums'
}))

export interface ValueParameterItemProps
  extends Omit<ComponentPropsWithoutRef<typeof Value>, 'children'>,
    Pick<ParameterItemProps, 'label' | 'labelFontSize' | 'description'> {
  value: ReactNode
}

export const ValueParameterItem = forwardRef<
  HTMLDivElement,
  ValueParameterItemProps
>(({ label, labelFontSize, description, value, onChange, ...props }, ref) => (
  <ParameterItem
    ref={ref}
    label={label}
    labelFontSize={labelFontSize}
    description={description}
    control={<Value {...props}>{value}</Value>}
  />
))
