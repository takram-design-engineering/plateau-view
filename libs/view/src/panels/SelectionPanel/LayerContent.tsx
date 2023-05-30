import { Divider, IconButton, Tooltip } from '@mui/material'
import { atom, useAtom, useSetAtom, type SetStateAction } from 'jotai'
import { useCallback, useMemo } from 'react'
import invariant from 'tiny-invariant'

import { removeLayerAtom, type LayerType } from '@takram/plateau-layers'
import {
  InfoIcon,
  Inspector,
  InspectorActions,
  InspectorHeader,
  LocationIcon,
  TrashIcon,
  VisibilityOffIcon,
  VisibilityOnIcon
} from '@takram/plateau-ui-components'
import { layerTypeIcons, layerTypeNames } from '@takram/plateau-view-layers'

import {
  type LAYER_SELECTION,
  type SelectionGroup
} from '../../states/selection'

export interface LayerContentProps<T extends LayerType> {
  values: (SelectionGroup & {
    type: typeof LAYER_SELECTION
    subtype: T
  })['values']
}

export function LayerContent<T extends LayerType>({
  values
}: LayerContentProps<T>): JSX.Element | null {
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

  const remove = useSetAtom(removeLayerAtom)
  const handleRemove = useCallback(() => {
    values.forEach(value => {
      remove(value.id)
    })
  }, [values, remove])

  invariant(values.length > 0)
  const type = values[0].type

  return (
    <Inspector>
      <InspectorHeader
        title={
          values.length === 1
            ? `${layerTypeNames[type]}レイヤー`
            : `${values.length}個の${layerTypeNames[type]}レイヤー`
        }
        iconComponent={layerTypeIcons[type]}
      />
      <Divider light />
      <InspectorActions>
        <Tooltip title={hidden ? '表示' : '隠す'}>
          <IconButton
            color='inherit'
            aria-label={hidden ? '表示' : '隠す'}
            onClick={handleToggleHidden}
          >
            {hidden ? <VisibilityOffIcon /> : <VisibilityOnIcon />}
          </IconButton>
        </Tooltip>
        <Tooltip title='移動'>
          <span>
            <IconButton aria-label='移動' disabled>
              <LocationIcon />
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
      </InspectorActions>
    </Inspector>
  )
}
