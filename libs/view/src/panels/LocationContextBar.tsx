import { Divider, Stack } from '@mui/material'
import { Fragment, useMemo, type FC } from 'react'

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
              {datasets.map(dataset => (
                <Fragment key={dataset.id}>
                  {dataset.variants.length === 1 ? (
                    <ContextButton>{dataset.typeName}</ContextButton>
                  ) : dataset.__typename === 'PlateauBuildingDataset' ? (
                    municipalityCode != null ? (
                      <BuildingDatasetSelect
                        dataset={dataset}
                        municipalityCode={municipalityCode}
                      />
                    ) : null
                  ) : (
                    <DefaultDatasetSelect dataset={dataset} />
                  )}
                </Fragment>
              ))}
            </Stack>
          </>
        )}
      </Stack>
    </ContextBar>
  )
}
