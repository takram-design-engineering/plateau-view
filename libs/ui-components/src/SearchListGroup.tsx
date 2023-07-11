import {
  Button,
  ListItemSecondaryAction,
  listItemSecondaryActionClasses,
  ListSubheader,
  styled,
  type ListSubheaderProps
} from '@mui/material'
import { type FC, type MouseEvent } from 'react'

const StyledListSubheader = styled(ListSubheader)(({ theme }) => ({
  ...theme.typography.subtitle2,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  minHeight: theme.spacing(5),
  [`& .${listItemSecondaryActionClasses.root}`]: {
    right: theme.spacing(1)
  }
}))

export interface SearchListGroupProps
  extends Omit<ListSubheaderProps, 'onClick'> {
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
}

export const SearchListGroup: FC<SearchListGroupProps> = ({
  children,
  onClick,
  ...props
}) => (
  <StyledListSubheader {...props}>
    {children}
    <ListItemSecondaryAction>
      <Button variant='text' size='small' onClick={onClick}>
        絞り込み
      </Button>
    </ListItemSecondaryAction>
  </StyledListSubheader>
)
