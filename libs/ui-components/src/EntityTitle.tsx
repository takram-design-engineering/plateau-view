import {
  ListItem,
  ListItemText,
  listItemTextClasses,
  styled,
  svgIconClasses,
  type ListItemProps,
  type SvgIconProps
} from '@mui/material'
import { forwardRef, type ComponentType } from 'react'

const StyledListItem = styled(ListItem)(({ theme }) => ({
  alignItems: 'center',
  minHeight: theme.spacing(5)
})) as unknown as typeof ListItem // For generics

export const EntityTitleIcon = styled('div')(({ theme }) => ({
  marginRight: theme.spacing(1.5),
  [`& .${svgIconClasses.root}`]: {
    display: 'block'
  }
}))

export const EntityTitleText = styled(ListItemText)(({ theme }) => ({
  marginTop: 4,
  marginBottom: 4,
  [`& .${listItemTextClasses.primary}`]: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  },
  [`& .${listItemTextClasses.secondary}`]: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    marginTop: '0.1em'
  }
}))

export interface EntityTitleProps extends Omit<ListItemProps<'div'>, 'title'> {
  title?:
    | string
    | {
        primary: string
        secondary?: string
      }
  iconComponent: ComponentType<SvgIconProps>
}

export const EntityTitle = forwardRef<HTMLDivElement, EntityTitleProps>(
  ({ title, iconComponent, children, ...props }, ref) => {
    const Icon = iconComponent
    return (
      <StyledListItem ref={ref} {...props} component='div'>
        <EntityTitleIcon>
          <Icon fontSize='medium' />
        </EntityTitleIcon>
        <EntityTitleText
          primary={typeof title === 'object' ? title?.primary : title}
          secondary={typeof title === 'object' ? title?.secondary : undefined}
          primaryTypographyProps={{
            variant: 'body1'
          }}
          secondaryTypographyProps={{
            variant: 'body2'
          }}
        />
        {children}
      </StyledListItem>
    )
  }
)
