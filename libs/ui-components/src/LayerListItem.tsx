import {
  IconButton,
  ListItemSecondaryAction,
  styled,
  Tooltip
} from '@mui/material'
import {
  useState,
  type FC,
  type MouseEventHandler,
  type SyntheticEvent
} from 'react'

import { useForkEventHandler } from '@takram/plateau-react-helpers'

import {
  EntityTitleButton,
  type EntityTitleButtonProps
} from './EntityTitleButton'
import { TrashIcon } from './icons/TrashIcon'
import { VisibilityOffIcon } from './icons/VisibilityOffIcon'
import { VisibilityOnIcon } from './icons/VisibilityOnIcon'

const HoverMenuRoot = styled(ListItemSecondaryAction)(({ theme }) => ({
  position: 'relative',
  inset: 0,
  transform: 'none',
  flexShrink: 0,
  flexGrow: 0,
  marginRight: theme.spacing(-1)
}))

function stopPropagation(event: SyntheticEvent): void {
  event.stopPropagation()
}

interface HoverMenuProps {
  hovered?: boolean
  hidden?: boolean
  onRemove?: MouseEventHandler<HTMLButtonElement>
  onToggleHidden?: MouseEventHandler<HTMLButtonElement>
}

const HoverMenu: FC<HoverMenuProps> = ({
  hovered = false,
  hidden = false,
  onRemove,
  onToggleHidden
}) => {
  if (!hovered && !hidden) {
    return null
  }
  return (
    <HoverMenuRoot onMouseDown={stopPropagation}>
      {(hovered || !hidden) && (
        <Tooltip title='削除'>
          <IconButton color='inherit' aria-label='削除' onClick={onRemove}>
            <TrashIcon fontSize='small' />
          </IconButton>
        </Tooltip>
      )}
      <Tooltip title={hidden ? '表示' : '隠す'}>
        <IconButton
          color='inherit'
          aria-label={hidden ? '表示' : '隠す'}
          onClick={onToggleHidden}
        >
          {hidden ? (
            <VisibilityOffIcon fontSize='small' />
          ) : (
            <VisibilityOnIcon fontSize='small' />
          )}
        </IconButton>
      </Tooltip>
    </HoverMenuRoot>
  )
}

export interface LayerListItemProps
  extends EntityTitleButtonProps,
    Omit<HoverMenuProps, 'hidden'> {}

export const LayerListItem: FC<LayerListItemProps> = ({
  hidden = false,
  onRemove,
  onToggleHidden,
  onMouseEnter,
  onMouseLeave,
  ...props
}) => {
  const [hovered, setHovered] = useState(false)
  const handleMouseEnter = useForkEventHandler(onMouseEnter, () => {
    setHovered(true)
  })
  const handleMouseLeave = useForkEventHandler(onMouseLeave, () => {
    setHovered(false)
  })
  return (
    <EntityTitleButton
      {...props}
      hidden={hidden}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <HoverMenu
        hovered={hovered}
        hidden={hidden}
        onRemove={onRemove}
        onToggleHidden={onToggleHidden}
      />
    </EntityTitleButton>
  )
}
