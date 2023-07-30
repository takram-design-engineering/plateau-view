import { Divider, IconButton, List, Tooltip } from '@mui/material'
import {
  atom,
  useAtom,
  useAtomValue,
  useSetAtom,
  type SetStateAction
} from 'jotai'
import { useCallback, useMemo } from 'react'
import invariant from 'tiny-invariant'

import { useCesium } from '@takram/plateau-cesium'
import { flyToBoundingSphere } from '@takram/plateau-cesium-helpers'
import {
  layerSelectionAtom,
  removeLayerAtom,
  type LayerType
} from '@takram/plateau-layers'
import {
  AddressIcon,
  InfoIcon,
  InspectorHeader,
  InspectorItem,
  TrashIcon,
  VisibilityOffIcon,
  VisibilityOnIcon
} from '@takram/plateau-ui-components'
import { layerTypeIcons, layerTypeNames } from '@takram/plateau-view-layers'

import {
  type LAYER_SELECTION,
  type SelectionGroup
} from '../../states/selection'
import { LayerColorSection } from './LayerColorSection'
import { LayerHiddenFeaturesSection } from './LayerHiddenFeaturesSection'
import { LayerOpacitySection } from './LayerOpacitySection'
import { LayerShowWireframeSection } from './LayerShowWireframeSection'

export interface LayerContentProps<T extends LayerType> {
  values: (SelectionGroup & {
    type: typeof LAYER_SELECTION
    subtype: T
  })['values']
}

export function LayerContent<T extends LayerType>({
  values
}: LayerContentProps<T>): JSX.Element | null {
  invariant(values.length > 0)
  const type = values[0].type

  const setSelection = useSetAtom(layerSelectionAtom)
  const handleClose = useCallback(() => {
    setSelection([])
  }, [setSelection])

  const hiddenAtom = useMemo(() => {
    const atoms = values.map(value => value.hiddenAtom)
    return atom(
      get => atoms.every(atom => get(atom)),
      (get, set, value: SetStateAction<boolean>) => {
        atoms.forEach(atom => {
          set(atom, value)
        })
      }
    )
  }, [values])

  const [hidden, setHidden] = useAtom(hiddenAtom)
  const handleToggleHidden = useCallback(() => {
    setHidden(value => !value)
  }, [setHidden])

  const boundingSphereAtom = useMemo(
    () =>
      atom(get =>
        values.length === 1 ? get(values[0].boundingSphereAtom) : null
      ),
    [values]
  )
  const boundingSphere = useAtomValue(boundingSphereAtom)
  const scene = useCesium(({ scene }) => scene, { indirect: true })
  const handleMove = useCallback(() => {
    if (boundingSphere == null || scene == null) {
      return
    }
    void flyToBoundingSphere(scene, boundingSphere)
  }, [boundingSphere, scene])

  const remove = useSetAtom(removeLayerAtom)
  const handleRemove = useCallback(() => {
    values.forEach(value => {
      remove(value.id)
    })
  }, [values, remove])

  return (
    <List disablePadding>
      <InspectorHeader
        title={
          values.length === 1
            ? `${layerTypeNames[type]}レイヤー`
            : `${values.length}個の${layerTypeNames[type]}レイヤー`
        }
        iconComponent={layerTypeIcons[type]}
        actions={
          <>
            <Tooltip title={hidden ? '表示' : '隠す'}>
              <IconButton
                aria-label={hidden ? '表示' : '隠す'}
                onClick={handleToggleHidden}
              >
                {hidden ? <VisibilityOffIcon /> : <VisibilityOnIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title='移動'>
              <span>
                <IconButton
                  aria-label='移動'
                  disabled={boundingSphere == null}
                  onClick={handleMove}
                >
                  <AddressIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title='出典'>
              <span>
                <IconButton aria-label='出典' disabled>
                  <InfoIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title='削除'>
              <IconButton aria-label='削除' onClick={handleRemove}>
                <TrashIcon />
              </IconButton>
            </Tooltip>
          </>
        }
        onClose={handleClose}
      />
      <LayerHiddenFeaturesSection layers={values} />
      <LayerColorSection layers={values} />
      <Divider light />
      <InspectorItem>
        <LayerOpacitySection layers={values} />
        <LayerShowWireframeSection layers={values} />
      </InspectorItem>
    </List>
  )
}
