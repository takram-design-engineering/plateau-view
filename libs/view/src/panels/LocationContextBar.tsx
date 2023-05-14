import {
  Divider,
  Stack,
  Typography,
  type SelectChangeEvent
} from '@mui/material'
import { useAtomValue } from 'jotai'
import { groupBy, uniqBy } from 'lodash'
import { Fragment, useCallback, useState, type FC } from 'react'
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
  const { data } = useMunicipalityDatasetsQuery({
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

  if (address == null) {
    return null
  }

  const buildingDataset = data?.municipality?.datasets.find(
    (dataset): dataset is PlateauBuildingDataset =>
      dataset.__typename === 'PlateauBuildingDataset'
  )

  return (
    <ContextBar>
      <Stack direction='row' spacing={1} alignItems='center' height='100%'>
        <LocationBreadcrumbs />
        <Divider orientation='vertical' light />
        <Stack direction='row' spacing={1} alignItems='center' height='100%'>
          {buildingDataset != null && buildingDataset.variants.length > 0 && (
            <ContextButtonSelect
              label='建築物'
              value={building}
              onChange={handleChange}
            >
              {Object.entries(groupBy(buildingDataset.variants, 'version')).map(
                ([version, variants]) => (
                  <Fragment key={version}>
                    {uniqBy(variants, 'lod').map(variant => (
                      <SelectItem key={variant.url} value={variant.url}>
                        <Stack>
                          <Typography variant='body2'>
                            LOD {variant.lod}
                          </Typography>
                          <Typography variant='caption' color='text.secondary'>
                            {variant.version}年度版
                          </Typography>
                        </Stack>
                      </SelectItem>
                    ))}
                  </Fragment>
                )
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
