import { Typography } from '@mui/material'
import { type FC } from 'react'
import invariant from 'tiny-invariant'

import { type PlateauDatasetFragment } from '@takram/plateau-graphql'
import {
  ContextSelect,
  SelectGroupItem,
  SelectItem
} from '@takram/plateau-ui-components'

import { datasetTypeNames } from '../../constants/datasetTypeNames'

export interface DefaultDatasetSelectProps {
  datasets: PlateauDatasetFragment[]
  municipalityCode: string
  disabled?: boolean
}

export const DefaultDatasetSelect: FC<DefaultDatasetSelectProps> = ({
  datasets,
  municipalityCode,
  disabled
}) => {
  return (
    <ContextSelect
      label={datasetTypeNames[datasets[0].type]}
      value={[] as string[]}
      disabled={disabled}
    >
      {datasets.flatMap((dataset, index) => {
        if (dataset.data.length > 1) {
          return [
            <SelectGroupItem key={index} size='small'>
              {dataset.name}
            </SelectGroupItem>,
            ...dataset.data.map(datum => (
              <SelectItem key={datum.url} indent={1} value={datum.url}>
                <Typography variant='body2'>{datum.name}</Typography>
              </SelectItem>
            ))
          ]
        }
        invariant(dataset.data.length === 1)
        const [datum] = dataset.data
        return (
          <SelectItem key={datum.url} value={datum.url}>
            <Typography variant='body2'>{dataset.name}</Typography>
          </SelectItem>
        )
      })}
    </ContextSelect>
  )
}
