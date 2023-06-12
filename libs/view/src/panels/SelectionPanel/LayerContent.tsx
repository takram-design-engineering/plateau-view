import RemoveIcon from '@mui/icons-material/Remove'
import { Divider, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import { atom, useAtom } from 'jotai'
import { sumBy } from 'lodash'
import { useMemo, type FC } from 'react'
import invariant from 'tiny-invariant'

import { type LayerModel, type LayerType } from '@takram/plateau-layers'
import {
  Inspector,
  InspectorHeader,
  InspectorItem,
  ParameterList,
  ValueParameterItem
} from '@takram/plateau-ui-components'
import {
  BUILDING_LAYER,
  layerTypeIcons,
  layerTypeNames
} from '@takram/plateau-view-layers'

import {
  type LAYER_SELECTION,
  type SelectionGroup
} from '../../states/selection'
import { LayerActions } from './LayerActions'

const BuildingLayerContent: FC<{
  values: (SelectionGroup & {
    type: typeof LAYER_SELECTION
    subtype: typeof BUILDING_LAYER
  })['values']
}> = ({ values }) => {
  const hiddenFeaturesAtom = useMemo(() => {
    const atoms = values.map(value => value.hiddenFeaturesAtom)
    return atom(
      get => sumBy(atoms, atom => get(atom)?.length ?? 0),
      (get, set) => {
        atoms.forEach(atom => {
          set(atom, null)
        })
      }
    )
  }, [values])

  const [hiddenFeatureCount, showAllHiddenFeatures] =
    useAtom(hiddenFeaturesAtom)
  return (
    <InspectorItem>
      <ParameterList>
        {hiddenFeatureCount > 0 && (
          <ValueParameterItem
            label='非表示の建築物'
            value={
              <Stack direction='row' spacing={1} alignItems='center'>
                <Typography variant='body2' color='text.secondary'>
                  {hiddenFeatureCount}個
                </Typography>
                <Tooltip title='再表示'>
                  <IconButton
                    aria-label='再表示'
                    color='inherit'
                    onClick={showAllHiddenFeatures}
                  >
                    <RemoveIcon fontSize='small' />
                  </IconButton>
                </Tooltip>
              </Stack>
            }
          />
        )}
      </ParameterList>
    </InspectorItem>
  )
}

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

  return (
    <Inspector sx={{ width: 360 }}>
      <InspectorHeader
        title={
          values.length === 1
            ? `${layerTypeNames[type]}レイヤー`
            : `${values.length}個の${layerTypeNames[type]}レイヤー`
        }
        iconComponent={layerTypeIcons[type]}
      />
      <Divider light />
      <LayerActions values={values} />
      {type === BUILDING_LAYER && (
        <>
          <Divider light />
          <BuildingLayerContent
            values={values as Array<LayerModel<typeof BUILDING_LAYER>>}
          />
        </>
      )}
    </Inspector>
  )
}
