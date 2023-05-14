import { Divider, Stack, Typography } from '@mui/material'
import { type FC } from 'react'

import {
  ContextBar,
  ContextButton,
  ContextButtonSelect,
  ContextSelect,
  SelectItem
} from '@plateau/ui-components'

import { useLocationContextState } from '../hooks/useLocationContextState'
import { LocationBreadcrumbs } from './LocationContextBar/LocationBreadcrumbs'

export const LocationContextBar: FC = () => {
  const { address, datasets } = useLocationContextState()
  if (address == null) {
    return null
  }
  return (
    <ContextBar>
      <Stack direction='row' spacing={1} alignItems='center' height='100%'>
        <LocationBreadcrumbs address={address} />
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
                dataset.variants.length === 1 ? (
                  <ContextButton>{dataset.typeName}</ContextButton>
                ) : dataset.__typename === 'PlateauBuildingDataset' ? (
                  <ContextButtonSelect label={dataset.typeName} value=''>
                    {dataset.variants.map(variant => (
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
                  </ContextButtonSelect>
                ) : (
                  <ContextSelect
                    label={dataset.typeName}
                    value={[] as string[]}
                  >
                    {dataset.variants.map(variant => (
                      <SelectItem key={variant.url} value={variant.url}>
                        <Typography variant='body2'>{variant.name}</Typography>
                      </SelectItem>
                    ))}
                  </ContextSelect>
                )
              )}
            </Stack>
          </>
        )}
      </Stack>
    </ContextBar>
  )
}
