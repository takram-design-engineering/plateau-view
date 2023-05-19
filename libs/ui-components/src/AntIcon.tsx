import type Icon from '@ant-design/icons'
import { styled, type SvgIconProps } from '@mui/material'
import {
  forwardRef,
  type ComponentProps,
  type ComponentPropsWithRef,
  type ComponentType
} from 'react'

const Root = styled('span', {
  shouldForwardProp: prop => prop !== 'fontSize'
})<{
  fontSize?: SvgIconProps['fontSize']
}>(({ theme, fontSize = 'medium' }) => ({
  fontSize: {
    inherit: 'inherit',
    small: theme.typography.pxToRem(16),
    medium: theme.typography.pxToRem(24),
    large: theme.typography.pxToRem(32)
  }[fontSize]
}))

export interface AntIconProps
  extends Omit<ComponentPropsWithRef<typeof Root>, 'fontSize'> {
  iconComponent: ComponentType<ComponentProps<typeof Icon>>
  fontSize?: SvgIconProps['fontSize']
}

export const AntIcon = forwardRef<HTMLSpanElement, AntIconProps>(
  ({ iconComponent: IconComponent, ...props }, ref) => (
    <Root ref={ref} {...props}>
      <IconComponent />
    </Root>
  )
)
