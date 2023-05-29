import { type FC } from 'react'

import { EntityTitle, type EntityTitleProps } from './EntityTitle'

export interface InspectorHeaderProps extends EntityTitleProps {}

export const InspectorHeader: FC<InspectorHeaderProps> = props => (
  <EntityTitle {...props} />
)
