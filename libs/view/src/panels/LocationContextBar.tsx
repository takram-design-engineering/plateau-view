import {
  Divider,
  Stack,
  Typography,
  type SelectChangeEvent
} from '@mui/material'
import { useAtomValue } from 'jotai'
import { useCallback, useState, type FC } from 'react'
import invariant from 'tiny-invariant'

import {
  useMunicipalityDatasetsQuery,
  type PlateauBuildingDataset
} from '@plateau/graphql'
import {
  ContextBar,
  ContextButton,
  ContextButtonSelect,
  ContextSelect,
  SelectItem
} from '@plateau/ui-components'

import { municipalityAddressAtom } from '../states/address'
import { LocationBreadcrumbs } from './LocationContextBar/LocationBreadcrumbs'

export const LocationContextBar: FC = () => {
  const address = useAtomValue(municipalityAddressAtom)
  const { data, loading } = useMunicipalityDatasetsQuery({
    variables:
      address != null
        ? {
            municipalityCode: address?.municipalityCode
          }
        : undefined,
    skip: address == null
  })

  const [building, setBuilding] = useState<string>('')
  const handleChange = useCallback((event: SelectChangeEvent<string>) => {
    invariant(!Array.isArray(event.target.value))
    setBuilding(event.target.value)
  }, [])

  if (address == null || loading) {
    return null
  }
  invariant(data != null) // TODO: Show error snackbar

  const buildingDatasets =
    data.municipality?.datasets.filter(
      (dataset): dataset is PlateauBuildingDataset =>
        dataset.__typename === 'PlateauBuildingDataset'
    ) ?? []

  return (
    <ContextBar>
      <Stack direction='row' spacing={1} alignItems='center' height='100%'>
        <LocationBreadcrumbs />
        <Divider orientation='vertical' light />
        <Stack direction='row' spacing={1} alignItems='center' height='100%'>
          {buildingDatasets.length > 0 && (
            <ContextButtonSelect
              label='建築物'
              value={building}
              onChange={handleChange}
            >
              {buildingDatasets.flatMap(dataset =>
                dataset.variants.map(variant => (
                  <SelectItem key={variant.url} value={variant.url}>
                    <Typography variant='body2'>LOD {variant.lod}</Typography>
                  </SelectItem>
                ))
              )}
            </ContextButtonSelect>
          )}
          <ContextButton>避難施設</ContextButton>
          <ContextButton>ランドマーク</ContextButton>
          <ContextButton>鉄道駅</ContextButton>
          <ContextSelect label='ユースケース' value={[]}>
            <SelectItem value=''>
              <Typography variant='body2'>ユースケース</Typography>
            </SelectItem>
          </ContextSelect>
        </Stack>
      </Stack>
    </ContextBar>
  )
}
