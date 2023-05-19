import { Divider, Stack } from '@mui/material'
import { useMemo, type FC } from 'react'

import { ContextBar } from '@plateau/ui-components'

import { useLocationContextState } from '../hooks/useLocationContextState'
import { BuildingDatasetButtonSelect } from './LocationContextBar/BuildingDatasetButtonSelect'
import { DefaultDatasetButton } from './LocationContextBar/DefaultDatasetButton'
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
                    <BuildingDatasetButtonSelect
                      key={dataset.id}
                      dataset={dataset}
                      municipalityCode={municipalityCode}
                    />
                  ) : null
                ) : dataset.variants.length === 1 ? (
                  municipalityCode != null ? (
                    <DefaultDatasetButton
                      key={dataset.id}
                      dataset={dataset}
                      municipalityCode={municipalityCode}
                    />
                  ) : null
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
