import { Typography } from '@mui/material'
import { type FC } from 'react'

import { type PlateauDatasetFragment } from '@takram/plateau-graphql'
import { ContextSelect, SelectItem } from '@takram/plateau-ui-components'

import { datasetTypeNames } from '../../constants/datasetTypeNames'

export interface DefaultDatasetSelectProps {
  dataset: PlateauDatasetFragment
  disabled?: boolean
}

export const DefaultDatasetSelect: FC<DefaultDatasetSelectProps> = ({
  dataset,
  disabled
}) => {
  return (
    <ContextSelect
      label={datasetTypeNames[dataset.type]}
      value={[] as string[]}
      disabled={disabled}
    >
      {dataset.data.map(datum => (
        <SelectItem key={datum.url} value={datum.url}>
          <Typography variant='body2'>{datum.name}</Typography>
        </SelectItem>
      ))}
    </ContextSelect>
  )
}
