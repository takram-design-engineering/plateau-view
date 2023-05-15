import { Divider, Stack, Typography } from '@mui/material'
import { Fragment, type FC } from 'react'

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
  const { areas, datasets } = useLocationContextState()
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
                    <ContextButtonSelect label={dataset.typeName} value=''>
                      {dataset.variants.map(variant => (
                        <SelectItem key={variant.url} value={variant.url}>
                          <Stack>
                            <Typography variant='body2'>
                              LOD {variant.lod}
                            </Typography>
                            <Typography
                              variant='caption'
                              color='text.secondary'
                            >
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
                          <Typography variant='body2'>
                            {variant.name}
                          </Typography>
                        </SelectItem>
                      ))}
                    </ContextSelect>
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
