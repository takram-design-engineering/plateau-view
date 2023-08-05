import { IconButton } from '@mui/material'
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { memo, useCallback, useMemo, type FC, type SyntheticEvent } from 'react'

import { useCesium } from '@takram/plateau-cesium'
import { flyToBoundingSphere } from '@takram/plateau-cesium-helpers'
import {
  removeLayerAtom,
  type LayerProps,
  type LayerType
} from '@takram/plateau-layers'
import {
  ColorMapIcon,
  ColorSetIcon,
  LayerListItem
} from '@takram/plateau-ui-components'

import { layerTypeIcons } from './layerTypeIcons'
import { colorSchemeSelectionAtom, highlightedLayersAtom } from './states'

function stopPropagation(event: SyntheticEvent): void {
  event.stopPropagation()
}

export type ViewLayerListItemProps<T extends LayerType = LayerType> =
  LayerProps<T>

export const ViewLayerListItem: FC<ViewLayerListItemProps> = memo(
  (props: ViewLayerListItemProps) => {
    const {
      id,
      type,
      selected,
      titleAtom,
      loadingAtom,
      hiddenAtom,
      boundingSphereAtom,
      itemProps
    } = props

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

    const colorScheme = useAtomValue(props.colorSchemeAtom)
    const colorMap = useAtomValue(
      useMemo(
        () =>
          atom(get =>
            colorScheme?.type === 'quantitative'
              ? get(colorScheme.colorMapAtom)
              : null
          ),
        [colorScheme]
      )
    )
    const colorSetColors = useAtomValue(
      useMemo(
        () =>
          atom(get =>
            colorScheme?.type === 'qualitative'
              ? get(colorScheme.colorsAtom)
              : null
          ),
        [colorScheme]
      )
    )

    const [colorSchemeSelection, setColorSchemeSelection] = useAtom(
      colorSchemeSelectionAtom
    )
    const colorSchemeSelected = useMemo(
      () => colorSchemeSelection.includes(id),
      [id, colorSchemeSelection]
    )
    const handleColorSchemeClick = useCallback(() => {
      setColorSchemeSelection([id])
    }, [id, setColorSchemeSelection])

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
          colorMap != null ? (
            <IconButton
              onMouseDown={stopPropagation}
              onDoubleClick={stopPropagation}
              onClick={handleColorSchemeClick}
            >
              <ColorMapIcon
                colorMap={colorMap}
                selected={colorSchemeSelected}
              />
            </IconButton>
          ) : colorSetColors != null ? (
            <IconButton
              onMouseDown={stopPropagation}
              onDoubleClick={stopPropagation}
              onClick={handleColorSchemeClick}
            >
              <ColorSetIcon
                colors={colorSetColors}
                selected={colorSchemeSelected}
              />
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
