import { memo, type FC } from 'react'

import { type LayerProps, type LayerType } from '@takram/plateau-layers'
import { LayerListItem } from '@takram/plateau-ui-components'

import { layerTypeIcons } from './layerTypeIcons'

export type ViewLayerListItemProps<T extends LayerType = LayerType> =
  LayerProps<T>

export const ViewLayerListItem: FC<ViewLayerListItemProps> = memo(
  (props: ViewLayerListItemProps) => (
    <LayerListItem {...props} iconComponent={layerTypeIcons[props.type]} />
  )
) as unknown as <T extends LayerType = LayerType>(
  props: ViewLayerListItemProps<T>
) => JSX.Element // For generics
