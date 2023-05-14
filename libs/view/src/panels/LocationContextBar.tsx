import {
  Breadcrumbs,
  Button,
  Divider,
  Stack,
  Typography,
  breadcrumbsClasses,
  buttonClasses,
  styled,
  type SelectChangeEvent
} from '@mui/material'
import { useAtomValue } from 'jotai'
import { useCallback, useState, type FC } from 'react'
import invariant from 'tiny-invariant'

import { useCesium } from '@plateau/cesium'
import { flyToPolygonEntity } from '@plateau/cesium-helpers'
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

import {
  municipalityAddressAtom,
  municipalityDataSourceAtom
} from '../states/address'

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  ...theme.typography.body2,
  margin: `0 ${theme.spacing(1)}`,
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: 'baseline',
    flexWrap: 'nowrap'
  },
  [`& .${breadcrumbsClasses.separator}`]: {
    margin: `0 ${theme.spacing(0.5)}`
  },
  [`& .${buttonClasses.text}`]: {
    minWidth: 0
  }
}))

export const LocationContextBar: FC = () => {
  const scene = useCesium(({ scene }) => scene, { indirect: true })
  const address = useAtomValue(municipalityAddressAtom)
  const dataSource = useAtomValue(municipalityDataSourceAtom)

  const { data, loading } = useMunicipalityDatasetsQuery({
    variables:
      address != null
        ? {
            municipalityCode: address?.municipalityCode
          }
        : undefined,
    skip: address == null
  })

  // TODO: Handle in atoms and make them declarative.
  const handlePrefecture = useCallback(() => {
    if (address == null || dataSource == null || scene == null) {
      return
    }
    flyToPolygonEntity(scene, dataSource.entities.values).catch(error => {
      console.error(error)
    })
  }, [address, dataSource, scene])

  const handleMunicipality = useCallback(() => {
    if (address == null || dataSource == null || scene == null) {
      return
    }
    const entities = dataSource.findEntities(address.municipalityCode)
    if (entities != null) {
      flyToPolygonEntity(scene, entities).catch(error => {
        console.error(error)
      })
    }
  }, [address, dataSource, scene])

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
        <StyledBreadcrumbs separator='›'>
          <Button
            variant='text'
            size='small'
            color='inherit'
            fullWidth
            onClick={handlePrefecture}
          >
            {address.prefectureName}
          </Button>
          <Button
            variant='text'
            size='small'
            color='inherit'
            onClick={handleMunicipality}
          >
            {address.municipalityName}
          </Button>
        </StyledBreadcrumbs>
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
