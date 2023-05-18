import type Icon from '@ant-design/icons'
import { styled, type SvgIconProps } from '@mui/material'
import {
  forwardRef,
  type ComponentProps,
  type ComponentPropsWithRef,
  type ComponentType
} from 'react'

const Root = styled('span', {
  shouldForwardProp: prop => prop !== 'size'
})<{
  size?: SvgIconProps['fontSize']
}>(({ theme, size = 'medium' }) => ({
  fontSize: {
    inherit: 'inherit',
    small: theme.typography.pxToRem(16),
    medium: theme.typography.pxToRem(20),
    large: theme.typography.pxToRem(32)
  }[size]
}))

export interface AntIconProps
  extends Omit<ComponentPropsWithRef<typeof Root>, 'size'> {
  iconComponent: ComponentType<ComponentProps<typeof Icon>>
  size?: SvgIconProps['fontSize']
}

export const AntIcon = forwardRef<HTMLSpanElement, AntIconProps>(
  ({ iconComponent: IconComponent, ...props }, ref) => (
    <Root ref={ref} {...props}>
      <IconComponent />
    </Root>
  )
)
