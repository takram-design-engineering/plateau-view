import LoadingIcon from '@ant-design/icons/LoadingOutlined'
import {
  IconButton,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  Tooltip,
  alpha,
  listItemButtonClasses,
  listItemSecondaryActionClasses,
  listItemTextClasses,
  styled,
  svgIconClasses,
  type ListItemButtonProps,
  type SvgIconProps
} from '@mui/material'
import {
  type ComponentType,
  type FC,
  type MouseEventHandler,
  type SyntheticEvent
} from 'react'

import { AntIcon } from './AntIcon'
import { ItemLocationIcon } from './icons/ItemLocationIcon'
import { ItemTrashIcon } from './icons/ItemTrashIcon'
import { ItemVisibilityIcon } from './icons/ItemVisibilityIcon'

const StyledListItemButton = styled(ListItemButton, {
  shouldForwardProp: prop => prop !== 'highlighted' && prop !== 'hidden'
})<{
  highlighted?: boolean
  hidden?: boolean
}>(({ theme, highlighted = false, hidden = false }) => {
  const highlightedColor = alpha(
    theme.palette.primary.main,
    theme.palette.action.focusOpacity
  )
  return {
    alignItems: 'center',
    minHeight: theme.spacing(5),
    transition: 'none',
    cursor: 'default',

    ...(highlighted
      ? {
          backgroundColor: highlightedColor,
          '&:hover': {
            backgroundColor: highlightedColor
          },
          [`&.${listItemButtonClasses.selected}:hover`]: {
            backgroundColor: highlightedColor
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
    },

    // Show secondary actions only when hovered
    [`& .${listItemSecondaryActionClasses.root}`]: {
      display: 'none'
    },
    [`&:hover .${listItemSecondaryActionClasses.root}`]: {
      display: 'block'
    }
  }
})

const ListItemIcon = styled('div')(({ theme }) => ({
  marginRight: theme.spacing(1.5),
  [`& .${svgIconClasses.root}`]: {
    display: 'block'
  }
}))

const StyledListItemText = styled(ListItemText)(({ theme }) => ({
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
    marginTop: theme.spacing(0.25)
  }
}))

const HoverMenuRoot = styled(ListItemSecondaryAction)(({ theme }) => ({
  position: 'relative',
  inset: 0,
  transform: 'none',
  flexShrink: 0,
  flexGrow: 0,
  marginRight: theme.spacing(-0.5),
  marginLeft: theme.spacing(0.5)
}))

function stopPropagation(event: SyntheticEvent): void {
  event.stopPropagation()
}

interface HoverMenuProps {
  hidden?: boolean
  onRemove?: MouseEventHandler<HTMLButtonElement>
  onToggleHidden?: MouseEventHandler<HTMLButtonElement>
}

const HoverMenu: FC<HoverMenuProps> = ({
  hidden = false,
  onRemove,
  onToggleHidden
}) => (
  <HoverMenuRoot onMouseDown={stopPropagation}>
    <Tooltip title='削除'>
      <IconButton
        size='small'
        color='inherit'
        aria-label='削除'
        onClick={onRemove}
      >
        <ItemTrashIcon fontSize='medium' />
      </IconButton>
    </Tooltip>
    <Tooltip title='移動'>
      <span>
        <IconButton size='small' color='inherit' aria-label='移動' disabled>
          <ItemLocationIcon fontSize='medium' />
        </IconButton>
      </span>
    </Tooltip>
    <Tooltip title={hidden ? '表示' : '隠す'}>
      <IconButton
        size='small'
        color='inherit'
        aria-label={hidden ? '表示' : '隠す'}
        onClick={onToggleHidden}
      >
        <ItemVisibilityIcon fontSize='medium' />
      </IconButton>
    </Tooltip>
  </HoverMenuRoot>
)

export type LayerListItemTitle =
  | string
  | {
      primary: string
      secondary?: string
    }

export interface LayerListItemProps
  extends Omit<ListItemButtonProps, 'title'>,
    Omit<HoverMenuProps, 'hidden'> {
  title?: LayerListItemTitle
  iconComponent: ComponentType<SvgIconProps>
  highlighted?: boolean
  selected?: boolean
  loading?: boolean
  hidden?: boolean
}

export const LayerListItem: FC<LayerListItemProps> = ({
  title,
  iconComponent,
  highlighted = false,
  selected = false,
  loading = false,
  hidden = false,
  onRemove,
  onToggleHidden,
  ...props
}) => {
  const Icon = iconComponent
  return (
    <StyledListItemButton
      {...props}
      selected={selected}
      highlighted={highlighted}
      hidden={hidden}
    >
      <ListItemIcon>
        {loading ? (
          <AntIcon iconComponent={LoadingIcon} fontSize='medium' />
        ) : (
          <Icon fontSize='medium' />
        )}
      </ListItemIcon>
      <StyledListItemText
        primary={typeof title === 'object' ? title?.primary : title}
        secondary={typeof title === 'object' ? title?.secondary : undefined}
        primaryTypographyProps={{
          variant: 'body2'
        }}
        secondaryTypographyProps={{
          variant: 'caption'
        }}
      />
      <HoverMenu
        hidden={hidden}
        onRemove={onRemove}
        onToggleHidden={onToggleHidden}
      />
    </StyledListItemButton>
  )
}
