import LoadingIcon from '@ant-design/icons/LoadingOutlined'
import {
  ListItemButton,
  alpha,
  listItemButtonClasses,
  listItemTextClasses,
  styled,
  type ListItemButtonProps,
  type SvgIconProps
} from '@mui/material'
import { forwardRef, type ComponentType } from 'react'

import { AntIcon } from './AntIcon'
import { EntityTitleIcon, EntityTitleText } from './EntityTitle'

const StyledListItemButton = styled(ListItemButton, {
  shouldForwardProp: prop => prop !== 'highlighted' && prop !== 'hidden'
})<{
  highlighted?: boolean
  hidden?: boolean
}>(({ theme, highlighted = false, hidden = false }) => ({
  alignItems: 'center',
  minHeight: theme.spacing(5),
  transition: 'none',
  cursor: 'default',

  ...(highlighted
    ? {
        backgroundColor: theme.palette.action.hover,
        '&:hover': {
          backgroundColor: theme.palette.action.hover
        },
        [`&.${listItemButtonClasses.selected}:hover`]: {
          backgroundColor: theme.palette.action.hover
        }
      }
    : {
        // Disable hover style
        backgroundColor: 'transparent',
        '&:hover': {
          backgroundColor: 'transparent'
        },
        [`&.${listItemButtonClasses.selected}:hover`]: {
          backgroundColor: 'transparent'
        }
      }),

  ...(hidden && {
    color: alpha(
      theme.palette.text.primary,
      theme.palette.action.disabledOpacity
    )
  }),

  [`&.${listItemButtonClasses.selected}`]: {
    color: theme.palette.getContrastText(theme.palette.primary.dark),
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.primary.main
    },
    [`& .${listItemTextClasses.secondary}`]: {
      color: theme.palette.getContrastText(theme.palette.primary.dark)
    }
  }
}))

export interface EntityTitleButtonProps
  extends Omit<ListItemButtonProps, 'title'> {
  title?:
    | string
    | {
        primary: string
        secondary?: string
      }
  iconComponent: ComponentType<SvgIconProps>
  highlighted?: boolean
  selected?: boolean
  loading?: boolean
  hidden?: boolean
}

export const EntityTitleButton = forwardRef<
  HTMLDivElement,
  EntityTitleButtonProps
>(
  (
    {
      title,
      iconComponent,
      highlighted = false,
      selected = false,
      loading = false,
      hidden = false,
      children,
      ...props
    },
    ref
  ) => {
    const Icon = iconComponent
    return (
      <StyledListItemButton
        ref={ref}
        {...props}
        selected={selected}
        highlighted={highlighted}
        hidden={hidden}
      >
        <EntityTitleIcon>
          {loading ? (
            <AntIcon iconComponent={LoadingIcon} fontSize='medium' />
          ) : (
            <Icon fontSize='medium' />
          )}
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
      </StyledListItemButton>
    )
  }
)
