import {
  ListSubheader,
  Typography,
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

const StyledListSubheader = styled(ListSubheader)(({ theme }) => ({
  padding: `6px ${theme.spacing(1.5)}`
}))

export const SelectGroupItem = forwardRef<
  HTMLElementTagNameMap[ListSubheaderTypeMap['defaultComponent']],
  SelectGroupItemProps
>(({ size = 'medium', children, ...props }, ref) => (
  <StyledListSubheader ref={ref} {...props}>
    <Typography variant={size === 'medium' ? 'subtitle1' : 'subtitle2'}>
      {children}
    </Typography>
  </StyledListSubheader>
)) as <C extends ElementType = ListSubheaderTypeMap['defaultComponent']>(
  props: SelectGroupItemProps<C>
) => JSX.Element // For generics
