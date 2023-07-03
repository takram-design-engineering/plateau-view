import { IconButton, Stack, Tooltip, Typography } from '@mui/material'
import { atom, useAtom } from 'jotai'
import { sumBy } from 'lodash'
import { useMemo, type FC } from 'react'

import { type LayerModel } from '@takram/plateau-layers'
import {
  MinusIcon,
  ParameterList,
  ValueParameterItem
} from '@takram/plateau-ui-components'

function hasHiddenFeaturesAtom(
  values: readonly LayerModel[]
): values is ReadonlyArray<
  Extract<LayerModel, { hiddenFeaturesAtom: unknown }>
> {
  return values.every(value => 'hiddenFeaturesAtom' in value)
}

export interface LayerHiddenFeaturesSectionProps {
  layers: readonly LayerModel[]
}

export const LayerHiddenFeaturesSection: FC<
  LayerHiddenFeaturesSectionProps
> = ({ layers }) => {
  const hiddenFeaturesAtom = useMemo(() => {
    const layerAtoms = hasHiddenFeaturesAtom(layers)
      ? layers.map(layer => layer.hiddenFeaturesAtom)
      : []
    return atom(
      get => sumBy(layerAtoms, layerAtom => get(layerAtom)?.length ?? 0),
      (get, set) => {
        layerAtoms.forEach(atom => {
          set(atom, null)
        })
      }
    )
  }, [layers])

  const [hiddenFeatureCount, showAllHiddenFeatures] =
    useAtom(hiddenFeaturesAtom)

  if (hiddenFeatureCount === 0) {
    return null
  }
  return (
    <ParameterList>
      {hiddenFeatureCount > 0 && (
        <ValueParameterItem
          label='非表示の建築物'
          value={
            <Stack
              direction='row'
              spacing={1}
              alignItems='center'
              sx={{ marginRight: -1 }}
            >
              <Typography variant='body2' color='text.secondary'>
                {hiddenFeatureCount}個
              </Typography>
              <Tooltip title='再表示'>
                <IconButton
                  aria-label='再表示'
                  color='inherit'
                  onClick={showAllHiddenFeatures}
                >
                  <MinusIcon fontSize='small' />
                </IconButton>
              </Tooltip>
            </Stack>
          }
        />
      )}
    </ParameterList>
  )
}
