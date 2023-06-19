import { IconButton, Tooltip } from '@mui/material'
import { atom, useAtom, useSetAtom, type SetStateAction } from 'jotai'
import { useCallback, useMemo } from 'react'
import invariant from 'tiny-invariant'

import { removeLayerAtom, type LayerType } from '@takram/plateau-layers'
import {
  InfoIcon,
  InspectorActions,
  LocationIcon,
  TrashIcon,
  VisibilityOffIcon,
  VisibilityOnIcon
} from '@takram/plateau-ui-components'

import {
  type LAYER_SELECTION,
  type SelectionGroup
} from '../../states/selection'

export interface LayerActionsProps<T extends LayerType> {
  values: (SelectionGroup & {
    type: typeof LAYER_SELECTION
    subtype: T
  })['values']
}

export function LayerActions<T extends LayerType>({
  values
}: LayerActionsProps<T>): JSX.Element | null {
  invariant(values.length > 0)

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

  return (
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
  )
}
