import {
  IconButton,
  listItemSecondaryActionClasses,
  styled,
  Tooltip
} from '@mui/material'
import { type FC, type MouseEvent } from 'react'

import { EntityTitle, type EntityTitleProps } from './EntityTitle'
import { CloseIcon } from './icons/CloseIcon'

const StyledEntityTitle = styled(EntityTitle)(({ theme }) => ({
  minHeight: theme.spacing(6),
  [`& .${listItemSecondaryActionClasses.root}`]: {
    right: 4
  }
}))

export interface InspectorHeaderProps extends EntityTitleProps {
  onClose?: (event: MouseEvent<HTMLButtonElement>) => void
}

export const InspectorHeader: FC<InspectorHeaderProps> = ({
  onClose,
  ...props
}) => (
  <StyledEntityTitle
    {...props}
    secondaryAction={
      onClose != null && (
        <Tooltip title='閉じる'>
          <IconButton aria-label='閉じる' onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Tooltip>
      )
    }
  />
)
