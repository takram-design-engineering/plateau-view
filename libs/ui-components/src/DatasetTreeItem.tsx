import { TreeItem, treeItemClasses } from '@mui/lab'
import { styled } from '@mui/material'
import { type ComponentPropsWithRef } from 'react'

export const DatasetTreeItem = styled(TreeItem, {
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

export type DatasetTreeItemProps = ComponentPropsWithRef<typeof DatasetTreeItem>
