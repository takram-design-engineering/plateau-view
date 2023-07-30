import { IconButton } from '@mui/material'
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { memo, useCallback, useMemo, type FC } from 'react'

import { useCesium } from '@takram/plateau-cesium'
import { flyToBoundingSphere } from '@takram/plateau-cesium-helpers'
import {
  removeLayerAtom,
  type LayerProps,
  type LayerType
} from '@takram/plateau-layers'
import { ColorSchemeIcon, LayerListItem } from '@takram/plateau-ui-components'

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
    itemProps,
    ...otherProps
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

    const colorSchemeAtom =
      'colorSchemeAtom' in otherProps ? otherProps.colorSchemeAtom : undefined
    const colorPropertyAtom =
      'colorPropertyAtom' in otherProps
        ? otherProps.colorPropertyAtom
        : undefined
    const colorScheme = useAtomValue(
      useMemo(
        () =>
          atom(get => {
            if (colorSchemeAtom == null) {
              return null
            }
            const colorScheme = get(colorSchemeAtom)
            if (colorPropertyAtom != null) {
              return get(colorPropertyAtom) != null ? colorScheme : null
            }
            return colorScheme
          }),
        [colorSchemeAtom, colorPropertyAtom]
      )
    )

    return (
      <LayerListItem
        {...itemProps}
        title={title ?? undefined}
        iconComponent={layerTypeIcons[type]}
        highlighted={highlighted}
        selected={selected}
        loading={loading}
        hidden={hidden}
        accessory={
          colorScheme != null ? (
            <IconButton>
              <ColorSchemeIcon colorScheme={colorScheme} />
            </IconButton>
          ) : undefined
        }
        onDoubleClick={handleDoubleClick}
        onRemove={handleRemove}
        onToggleHidden={handleToggleHidden}
      />
    )
  }
) as unknown as <T extends LayerType = LayerType>(
  props: ViewLayerListItemProps<T>
) => JSX.Element // For generics
