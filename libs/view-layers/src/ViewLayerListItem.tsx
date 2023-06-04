import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { memo, useCallback, useMemo, type FC } from 'react'

import { useCesium } from '@takram/plateau-cesium'
import { flyToBoundingSphere } from '@takram/plateau-cesium-helpers'
import {
  removeLayerAtom,
  type LayerProps,
  type LayerType
} from '@takram/plateau-layers'
import { LayerListItem } from '@takram/plateau-ui-components'

import { layerTypeIcons } from './layerTypeIcons'
import { highlightedLayersAtom } from './states'

export type ViewLayerListItemProps<T extends LayerType = LayerType> =
  LayerProps<T>

export const ViewLayerListItem: FC<ViewLayerListItemProps> = memo(
  ({
    id,
    type,
    selected,
    titleAtom,
    loadingAtom,
    hiddenAtom,
    boundingSphereAtom,
    itemProps
  }: ViewLayerListItemProps) => {
    const title = useAtomValue(titleAtom)
    const loading = useAtomValue(loadingAtom)

    const highlightedAtom = useMemo(
      () =>
        atom(get => get(highlightedLayersAtom).some(layer => layer.id === id)),
      [id]
    )
    const highlighted = useAtomValue(highlightedAtom)

    const boundingSphere = useAtomValue(boundingSphereAtom)
    const scene = useCesium(({ scene }) => scene, { indirect: true })
    const handleDoubleClick = useCallback(() => {
      if (boundingSphere == null || scene == null) {
        return
      }
      void flyToBoundingSphere(scene, boundingSphere)
    }, [boundingSphere, scene])

    const [hidden, setHidden] = useAtom(hiddenAtom)
    const handleToggleHidden = useCallback(() => {
      setHidden(value => !value)
    }, [setHidden])

    const remove = useSetAtom(removeLayerAtom)
    const handleRemove = useCallback(() => {
      remove(id)
    }, [id, remove])

    return (
      <LayerListItem
        {...itemProps}
        title={title ?? undefined}
        iconComponent={layerTypeIcons[type]}
        highlighted={highlighted}
        selected={selected}
        loading={loading}
        hidden={hidden}
        onDoubleClick={handleDoubleClick}
        onRemove={handleRemove}
        onToggleHidden={handleToggleHidden}
      />
    )
  }
) as unknown as <T extends LayerType = LayerType>(
  props: ViewLayerListItemProps<T>
) => JSX.Element // For generics
