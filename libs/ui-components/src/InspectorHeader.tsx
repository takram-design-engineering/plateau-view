import {
  Divider,
  IconButton,
  listItemSecondaryActionClasses,
  styled,
  Tooltip
} from '@mui/material'
import { type FC, type MouseEvent, type ReactNode } from 'react'

import { EntityTitle, type EntityTitleProps } from './EntityTitle'
import { CloseIcon } from './icons/CloseIcon'
import { InspectorActions } from './InspectorActions'

const StyledEntityTitle = styled(EntityTitle)(({ theme }) => ({
  minHeight: theme.spacing(6),
  [`& .${listItemSecondaryActionClasses.root}`]: {
    right: 4
  }
}))

export interface InspectorHeaderProps extends EntityTitleProps {
  actions?: ReactNode
  onClose?: (event: MouseEvent<HTMLButtonElement>) => void
}

export const InspectorHeader: FC<InspectorHeaderProps> = ({
  actions,
  onClose,
  ...props
}) => (
  <>
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
    {actions != null && (
      <>
        <Divider light />
        <InspectorActions>{actions}</InspectorActions>
      </>
    )}
  </>
)
