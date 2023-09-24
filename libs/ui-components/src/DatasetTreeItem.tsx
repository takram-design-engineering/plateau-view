import { TreeItem, treeItemClasses, type TreeItemProps } from '@mui/lab'
import { Stack, styled, useMediaQuery } from '@mui/material'
import { useState, type FC, type ReactNode } from 'react'

import { useForkEventHandler } from '@takram/plateau-react-helpers'

import { PrefixedCheckIcon } from './icons'

const StyledTreeItem = styled(TreeItem, {
  shouldForwardProp: prop => prop !== 'loading'
})<{
  loading?: boolean
}>(({ theme, loading = false }) => ({
  [`& .${treeItemClasses.group}`]: {
    marginLeft: theme.spacing(4)
  },
  [`& .${treeItemClasses.content}`]: {
    minHeight: `calc(${theme.spacing(3)} + 12px)`,
    paddingTop: 6,
    paddingBottom: 6
  },
  [`&  .${treeItemClasses.content} .${treeItemClasses.iconContainer}`]: {
    width: 24,
    height: 24,
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(0.5),
    color: theme.palette.action.active,
    '& svg': {
      // Reset icon size.
      width: 24,
      height: 24
    }
  },
  [`&  .${treeItemClasses.content} .${treeItemClasses.label}`]: {
    padding: 0,
    ...(loading && {
      color: theme.palette.text.disabled
    })
  }
}))

const Label = styled('div')(({ theme }) => ({
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis'
}))

const SecondaryAction = styled('div')(({ theme }) => ({
  height: 0,
  marginRight: theme.spacing(1),
  marginLeft: theme.spacing(0.5),
  '& > *': {
    transform: 'translateY(-50%)'
  }
}))

export interface DatasetTreeItemProps extends TreeItemProps {
  loading?: boolean
  selected?: boolean
  secondaryAction?: ReactNode
}

export const DatasetTreeItem: FC<DatasetTreeItemProps> = ({
  label,
  icon,
  selected = false,
  secondaryAction,
  onMouseEnter,
  onMouseLeave,
  ...props
}) => {
  const isTouch = useMediaQuery('(hover: none)')
  const [hovered, setHovered] = useState(isTouch)
  const handleMouseEnter = useForkEventHandler(onMouseEnter, () => {
    if (!isTouch) {
      setHovered(true)
    }
  })
  const handleMouseLeave = useForkEventHandler(onMouseLeave, () => {
    if (!isTouch) {
      setHovered(false)
    }
  })
  return (
    <StyledTreeItem
      {...props}
      label={
        <Stack
          direction='row'
          alignItems='center'
          justifyContent='space-between'
        >
          <Label>{label}</Label>
          {hovered && secondaryAction != null && (
            <SecondaryAction>{secondaryAction}</SecondaryAction>
          )}
        </Stack>
      }
      icon={selected ? <PrefixedCheckIcon color='primary' /> : icon}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  )
}
