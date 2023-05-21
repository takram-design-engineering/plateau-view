import { Divider, Stack } from '@mui/material'
import { useMemo, type FC } from 'react'
import invariant from 'tiny-invariant'

import { ContextBar } from '@takram/plateau-ui-components'

import { useLocationContextState } from '../hooks/useLocationContextState'
import { BuildingDatasetButtonSelect } from './LocationContextBar/BuildingDatasetButtonSelect'
import { DefaultDatasetButton } from './LocationContextBar/DefaultDatasetButton'
import { DefaultDatasetSelect } from './LocationContextBar/DefaultDatasetSelect'
import { LocationBreadcrumbs } from './LocationContextBar/LocationBreadcrumbs'

export const LocationContextBar: FC = () => {
  const { areas, datasetGroups } = useLocationContextState()
  const municipalityCode = useMemo(
    () => areas?.find(({ type }) => type === 'municipality')?.code,
    [areas]
  )
  if (areas == null || municipalityCode == null) {
    return null
  }
  return (
    <ContextBar>
      <Stack direction='row' spacing={1} alignItems='center' height='100%'>
        <LocationBreadcrumbs areas={areas} />
        {datasetGroups != null && (
          <>
            <Divider orientation='vertical' light />
            <Stack
              direction='row'
              spacing={1}
              alignItems='center'
              height='100%'
            >
              {datasetGroups.map((datasets, index) => {
                if (datasets.length > 1) {
                  return (
                    <DefaultDatasetSelect
                      key={datasets[0].id}
                      datasets={datasets}
                      municipalityCode={municipalityCode}
                    />
                  )
                }
                invariant(datasets.length === 1)
                const [dataset] = datasets
                return dataset.__typename === 'PlateauBuildingDataset' ? (
                  <BuildingDatasetButtonSelect
                    key={dataset.id}
                    dataset={dataset}
                    municipalityCode={municipalityCode}
                  />
                ) : dataset.data.length === 1 ? (
                  <DefaultDatasetButton
                    key={dataset.id}
                    dataset={dataset}
                    municipalityCode={municipalityCode}
                  />
                ) : (
                  <DefaultDatasetSelect
                    key={dataset.id}
                    datasets={[dataset]}
                    municipalityCode={municipalityCode}
                  />
                )
              })}
            </Stack>
          </>
        )}
      </Stack>
    </ContextBar>
  )
}
