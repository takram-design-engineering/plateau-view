import CheckIcon from '@mui/icons-material/Check'
import {
  ListItemIcon,
  listItemIconClasses,
  MenuItem,
  styled,
  SvgIcon,
  svgIconClasses,
  type MenuItemProps,
  type MenuItemTypeMap
} from '@mui/material'
import { forwardRef, type ElementType } from 'react'

export type SelectItemProps<
  C extends ElementType = MenuItemTypeMap['defaultComponent']
> = MenuItemProps<C, { component?: C }> & {
  indent?: number
}

const StyledMenuItem = styled(MenuItem, {
  shouldForwardProp: prop => prop !== 'indent'
})<{
  indent: number
}>(({ theme, indent }) => ({
  paddingLeft: theme.spacing(1 + indent * 2),
  paddingRight: theme.spacing(3),
  [`& .${listItemIconClasses.root}`]: {
    marginRight: theme.spacing(0.5),
    [`& .${svgIconClasses.root}`]: {
      fontSize: 16
    }
  }
}))

export const SelectItem = forwardRef<
  HTMLElementTagNameMap[MenuItemTypeMap['defaultComponent']],
  SelectItemProps
>(({ indent = 0, children, ...props }, ref) => (
  <StyledMenuItem ref={ref} {...props} indent={indent}>
    <ListItemIcon>
      {props.selected === true ? <CheckIcon /> : <SvgIcon />}
    </ListItemIcon>
    {children}
  </StyledMenuItem>
)) as <C extends ElementType = MenuItemTypeMap['defaultComponent']>(
  props: SelectItemProps<C>
) => JSX.Element // For generics
