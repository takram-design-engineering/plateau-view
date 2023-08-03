import { type StackProps } from '@mui/material'
import { type FC } from 'react'

import { type QualitativeColorSet } from '@takram/plateau-datasets'

export interface QualitativeColorLegendProps extends StackProps {
  colorSet: QualitativeColorSet
}

export const QualitativeColorLegend: FC<QualitativeColorLegendProps> = ({
  colorSet,
  ...props
}) => {
  return null
}
