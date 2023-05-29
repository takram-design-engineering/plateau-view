import {
  IconButton,
  ListItemSecondaryAction,
  Tooltip,
  listItemSecondaryActionClasses,
  styled
} from '@mui/material'
import { type FC, type MouseEventHandler, type SyntheticEvent } from 'react'

import {
  EntityTitleButton,
  type EntityTitleButtonProps
} from './EntityTitleButton'
import { LocationIcon } from './icons/LocationIcon'
import { TrashIcon } from './icons/TrashIcon'
import { VisibilityIcon } from './icons/VisibilityIcon'

const StyledEntityTitleButton = styled(EntityTitleButton)({
  // Show secondary actions only when hovered
  [`& .${listItemSecondaryActionClasses.root}`]: {
    display: 'none'
  },
  [`&:hover .${listItemSecondaryActionClasses.root}`]: {
    display: 'block'
  }
})

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
      <IconButton color='inherit' aria-label='削除' onClick={onRemove}>
        <TrashIcon fontSize='small' />
      </IconButton>
    </Tooltip>
    <Tooltip title='移動'>
      <span>
        <IconButton color='inherit' aria-label='移動' disabled>
          <LocationIcon fontSize='small' />
        </IconButton>
      </span>
    </Tooltip>
    <Tooltip title={hidden ? '表示' : '隠す'}>
      <IconButton
        color='inherit'
        aria-label={hidden ? '表示' : '隠す'}
        onClick={onToggleHidden}
      >
        <VisibilityIcon fontSize='small' />
      </IconButton>
    </Tooltip>
  </HoverMenuRoot>
)

export interface LayerListItemProps
  extends EntityTitleButtonProps,
    Omit<HoverMenuProps, 'hidden'> {}

export const LayerListItem: FC<LayerListItemProps> = ({
  hidden = false,
  onRemove,
  onToggleHidden,
  ...props
}) => (
  <StyledEntityTitleButton {...props} hidden={hidden}>
    <HoverMenu
      hidden={hidden}
      onRemove={onRemove}
      onToggleHidden={onToggleHidden}
    />
  </StyledEntityTitleButton>
)
