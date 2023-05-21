import {
  ListSubheader,
  styled,
  type ListSubheaderProps,
  type ListSubheaderTypeMap
} from '@mui/material'
import { forwardRef, type ElementType } from 'react'

export type SelectGroupItemProps<
  C extends ElementType = ListSubheaderTypeMap['defaultComponent']
> = ListSubheaderProps<C, { component?: C }> & {
  size?: 'small' | 'medium'
}

const StyledListSubheader = styled(ListSubheader, {
  shouldForwardProp: prop => prop !== 'size'
})<{
  size: 'small' | 'medium'
}>(({ theme, size }) => ({
  paddingTop: 6,
  paddingBottom: 6,
  paddingRight: theme.spacing(1.5),
  paddingLeft: `calc(${theme.spacing(1.5)} + 16px)`,
  ...(size === 'small' && {
    ...theme.typography.subtitle2,
    lineHeight: theme.typography.body2.lineHeight
  }),
  ...(size === 'medium' && {
    ...theme.typography.subtitle1,
    lineHeight: theme.typography.body1.lineHeight
  })
}))

export const SelectGroupItem = forwardRef<
  HTMLElementTagNameMap[ListSubheaderTypeMap['defaultComponent']],
  SelectGroupItemProps
>(({ size = 'medium', children, ...props }, ref) => (
  <StyledListSubheader ref={ref} {...props} size={size}>
    {children}
  </StyledListSubheader>
)) as <C extends ElementType = ListSubheaderTypeMap['defaultComponent']>(
  props: SelectGroupItemProps<C>
) => JSX.Element // For generics
