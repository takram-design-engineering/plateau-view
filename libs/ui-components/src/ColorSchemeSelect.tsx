import { Select, type SelectProps } from '@mui/material'
import { type FC } from 'react'

export interface ColorSchemeSelectProps extends SelectProps {}

export const ColorSchemeSelect: FC<ColorSchemeSelectProps> = props => {
  return <Select {...props} />
}
