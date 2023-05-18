import { Stack, Typography } from '@mui/material'
import { atom, useAtomValue } from 'jotai'
import { useMemo, type FC } from 'react'
import invariant from 'tiny-invariant'

import { type Area } from '@plateau/geocoder'
import { type PlateauDatasetFragment } from '@plateau/graphql'
import { useFindLayer } from '@plateau/layers'
import { ContextButtonSelect, SelectItem } from '@plateau/ui-components'
import { BUILDING_LAYER } from '@plateau/view-layers'

function makeValue(params: {
  version: string | null
  lod: number | null
  textured: boolean | null
}): string {
  return [params.version, params.lod, params.textured].join(':')
}

const nullAtom = atom(null)

export interface DefaultDatasetSelectProps {
  dataset: PlateauDatasetFragment & {
    __typename?: 'PlateauBuildingDataset'
  }
  areas: readonly Area[]
}

export const BuildingDatasetSelect: FC<DefaultDatasetSelectProps> = ({
  dataset,
  areas
}) => {
  const find = useFindLayer()
  const selectedValueAtom = useMemo(() => {
    const municipalityCode = areas.find(
      ({ type }) => type === 'municipality'
    )?.code
    if (municipalityCode == null) {
      return nullAtom
    }
    const layer = find({
      type: BUILDING_LAYER,
      municipalityCode
    })
    if (layer == null) {
      return nullAtom
    }
    return atom(get =>
      makeValue({
        version: get(layer.versionAtom),
        lod: get(layer.lodAtom),
        textured: get(layer.texturedAtom)
      })
    )
  }, [areas, find])

  const selectedValue = useAtomValue(selectedValueAtom)

  return (
    <ContextButtonSelect label={dataset.typeName} value={selectedValue ?? ''}>
      {dataset.variants.map(variant => {
        invariant(variant.__typename === 'PlateauBuildingDatasetVariant')
        const value = makeValue(variant)
        return (
          <SelectItem key={value} value={value}>
            <Stack>
              <Typography variant='body2'>LOD {variant.lod}</Typography>
              <Typography variant='caption' color='text.secondary'>
                {variant.version}年度版
              </Typography>
            </Stack>
          </SelectItem>
        )
      })}
    </ContextButtonSelect>
  )
}
