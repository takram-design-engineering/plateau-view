import { styled } from '@mui/material'
import { type FC } from 'react'

import { EntityTitle, type EntityTitleProps } from './EntityTitle'

const StyledEntityTitle = styled(EntityTitle)(({ theme }) => ({
  minHeight: theme.spacing(6)
}))

export interface InspectorHeaderProps extends EntityTitleProps {}

export const InspectorHeader: FC<InspectorHeaderProps> = props => (
  <StyledEntityTitle {...props} />
)
