import { memo, type FC } from 'react'

import { type LayerProps } from '@takram/plateau-layers'
import { LayerListItem } from '@takram/plateau-ui-components'

import { layerTypeIcons } from './layerTypeIcons'

export interface ViewLayerListItemProps extends LayerProps {}

export const ViewLayerListItem: FC<ViewLayerListItemProps> = memo(props => (
  <LayerListItem {...props} iconComponent={layerTypeIcons[props.type]} />
))
