import { TreeItem, treeItemClasses, type TreeItemProps } from '@mui/lab'
import { styled } from '@mui/material'
import { type FC } from 'react'

const StyledTreeItem = styled(TreeItem)(({ theme }) => ({
  [`& .${treeItemClasses.content}`]: {
    minHeight: `calc(${theme.spacing(3)} + 12px)`,
    paddingTop: 6,
    paddingBottom: 6
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: theme.spacing(4)
  },
  [`& .${treeItemClasses.iconContainer}`]: {
    width: 24,
    height: 24,
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    color: theme.palette.action.active,
    '& svg': {
      // Reset icon size.
      width: 24,
      height: 24
    }
  },
  [`& .${treeItemClasses.label}`]: {
    padding: 0
  }
}))

export type DatasetTreeItemProps = TreeItemProps

export const DatasetTreeItem: FC<DatasetTreeItemProps> = props => {
  return <StyledTreeItem {...props} />
}
