import { Typography } from '@mui/material'
import { type FC } from 'react'

import { type PlateauDatasetFragment } from '@plateau/graphql'
import { ContextSelect, SelectItem } from '@plateau/ui-components'

export interface DefaultDatasetSelectProps {
  dataset: PlateauDatasetFragment
}

export const DefaultDatasetSelect: FC<DefaultDatasetSelectProps> = ({
  dataset
}) => (
  <ContextSelect label={dataset.typeName} value={[] as string[]}>
    {dataset.variants.map(variant => (
      <SelectItem key={variant.url} value={variant.url}>
        <Typography variant='body2'>{variant.name}</Typography>
      </SelectItem>
    ))}
  </ContextSelect>
)
