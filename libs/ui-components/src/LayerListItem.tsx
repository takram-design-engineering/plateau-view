import LoadingIcon from '@ant-design/icons/LoadingOutlined'
import {
  IconButton,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  Tooltip,
  listItemButtonClasses,
  listItemSecondaryActionClasses,
  listItemTextClasses,
  styled
} from '@mui/material'
import { useAtom, useAtomValue, useSetAtom, type PrimitiveAtom } from 'jotai'
import { useCallback, type FC, type SyntheticEvent } from 'react'

import { useLayers, type LayerProps } from '@plateau/layers'

import { AntIcon } from './AntIcon'
import { ItemLocationIcon } from './icons/ItemLocationIcon'
import { ItemTrashIcon } from './icons/ItemTrashIcon'
import { ItemVisibilityIcon } from './icons/ItemVisibilityIcon'
import { layerIcons } from './layerIcons'
import { layerTypeNames } from './layerTypeNames'

const StyledListItem = styled(ListItemButton, {
  shouldForwardProp: prop => prop !== 'hidden'
})<{
  hidden?: boolean
}>(({ theme, hidden = false }) => ({
  height: theme.spacing(7),
  cursor: 'default',
  ...(hidden && {
    opacity: theme.palette.action.disabledOpacity
  }),

  // Disable hover style
  backgroundColor: 'transparent',
  '&:hover': {
    backgroundColor: 'transparent'
  },
  [`&.${listItemButtonClasses.selected}:hover`]: {
    backgroundColor: 'transparent'
  },

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
}))

const ListItemIcon = styled('span')(({ theme }) => ({
  marginRight: theme.spacing(1.5)
}))

const StyledListItemText = styled(ListItemText)(({ theme }) => ({
  [`& .${listItemTextClasses.secondary}`]: {
    marginTop: theme.spacing(0.25)
  }
}))

const HoverMenuRoot = styled(ListItemSecondaryAction)(({ theme }) => ({
  right: theme.spacing(1)
}))

function stopPropagation(event: SyntheticEvent): void {
  event.stopPropagation()
}

interface HoverMenuProps {
  id: string
  hiddenAtom: PrimitiveAtom<boolean>
}

const HoverMenu: FC<HoverMenuProps> = ({ id, hiddenAtom }) => {
  const [hidden, setHidden] = useAtom(hiddenAtom)
  const handleVisibilityClick = useCallback(() => {
    setHidden(value => !value)
  }, [setHidden])

  const { removeAtom } = useLayers()
  const remove = useSetAtom(removeAtom)
  const handleRemoveClick = useCallback(() => {
    remove(id)
  }, [id, remove])

  return (
    <HoverMenuRoot onMouseDown={stopPropagation}>
      <Tooltip title='削除'>
        <IconButton
          size='small'
          color='inherit'
          aria-label='削除'
          onClick={handleRemoveClick}
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
          onClick={handleVisibilityClick}
        >
          <ItemVisibilityIcon fontSize='medium' />
        </IconButton>
      </Tooltip>
    </HoverMenuRoot>
  )
}

export const LayerListItem: FC<LayerProps> = ({ layerAtom }) => {
  const { id, type, titleAtom, loadingAtom, hiddenAtom, selectedAtom } =
    useAtomValue(layerAtom)
  const title = useAtomValue(titleAtom)
  const loading = useAtomValue(loadingAtom)
  const hidden = useAtomValue(hiddenAtom)
  const selected = useAtomValue(selectedAtom)
  const Icon = layerIcons[type]
  return (
    <StyledListItem selected={selected} hidden={hidden}>
      <ListItemIcon>
        {loading ? (
          <AntIcon iconComponent={LoadingIcon} fontSize='medium' />
        ) : (
          <Icon fontSize='medium' />
        )}
      </ListItemIcon>
      <StyledListItemText
        primary={title ?? '\u00a0'} // Reserve line height
        secondary={layerTypeNames[type]}
        primaryTypographyProps={{
          variant: 'body2'
        }}
        secondaryTypographyProps={{
          variant: 'caption'
        }}
      />
      <HoverMenu id={id} hiddenAtom={hiddenAtom} />
    </StyledListItem>
  )
}
