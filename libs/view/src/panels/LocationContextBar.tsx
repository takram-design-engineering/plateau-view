import { Divider, Stack } from '@mui/material'
import { useMemo, type FC } from 'react'

import { ContextBar, ContextButton } from '@plateau/ui-components'

import { useLocationContextState } from '../hooks/useLocationContextState'
import { BuildingDatasetSelect } from './LocationContextBar/BuildingDatasetSelect'
import { DefaultDatasetSelect } from './LocationContextBar/DefaultDatasetSelect'
import { LocationBreadcrumbs } from './LocationContextBar/LocationBreadcrumbs'

export const LocationContextBar: FC = () => {
  const { areas, datasets } = useLocationContextState()
  const municipalityCode = useMemo(
    () => areas?.find(({ type }) => type === 'municipality')?.code,
    [areas]
  )
  if (areas == null) {
    return null
  }
  return (
    <ContextBar>
      <Stack direction='row' spacing={1} alignItems='center' height='100%'>
        <LocationBreadcrumbs areas={areas} />
        {datasets != null && (
          <>
            <Divider orientation='vertical' light />
            <Stack
              direction='row'
              spacing={1}
              alignItems='center'
              height='100%'
            >
              {datasets.map(dataset =>
                dataset.__typename === 'PlateauBuildingDataset' ? (
                  municipalityCode != null ? (
                    <BuildingDatasetSelect
                      key={dataset.id}
                      dataset={dataset}
                      municipalityCode={municipalityCode}
                    />
                  ) : null
                ) : dataset.variants.length === 1 ? (
                  <ContextButton key={dataset.id} disabled>
                    {dataset.typeName}
                  </ContextButton>
                ) : (
                  <DefaultDatasetSelect
                    key={dataset.id}
                    dataset={dataset}
                    disabled
                  />
                )
              )}
            </Stack>
          </>
        )}
      </Stack>
    </ContextBar>
  )
}
