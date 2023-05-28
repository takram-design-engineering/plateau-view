import { atom, useAtomValue } from 'jotai'
import { memo, useMemo, type FC } from 'react'

import { type LayerProps, type LayerType } from '@takram/plateau-layers'
import { LayerListItem } from '@takram/plateau-ui-components'

import { layerTypeIcons } from './layerTypeIcons'
import { highlightedLayersAtom } from './states'

export type ViewLayerListItemProps<T extends LayerType = LayerType> =
  LayerProps<T>

export const ViewLayerListItem: FC<ViewLayerListItemProps> = memo(
  (props: ViewLayerListItemProps) => {
    const highlightedAtom = useMemo(
      () =>
        atom(get =>
          get(highlightedLayersAtom).some(({ id }) => id === props.id)
        ),
      [props.id]
    )
    const highlighted = useAtomValue(highlightedAtom)
    return (
      <LayerListItem
        {...props}
        iconComponent={layerTypeIcons[props.type]}
        highlighted={highlighted}
      />
    )
  }
) as unknown as <T extends LayerType = LayerType>(
  props: ViewLayerListItemProps<T>
) => JSX.Element // For generics
