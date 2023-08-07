import { List, type ListProps } from '@mui/material'
import { useAtomValue } from 'jotai'
import { type FC } from 'react'

import { type QualitativeColorSet } from '@takram/plateau-datasets'

import { ColorSetListItem } from './ColorSetListItem'

export interface ColorSetListProps extends ListProps {
  colorsAtom: QualitativeColorSet['colorAtomsAtom']
  continuous?: boolean
  onChange?: () => void
}

export const ColorSetList: FC<ColorSetListProps> = ({
  colorsAtom,
  continuous = false,
  onChange,
  ...props
}) => {
  const colorsAtoms = useAtomValue(colorsAtom)
  return (
    <List disablePadding {...props}>
      {colorsAtoms.map(colorAtom => (
        <ColorSetListItem
          key={`${colorAtom}`}
          colorAtom={colorAtom}
          continuous={continuous}
          onChange={onChange}
        />
      ))}
    </List>
  )
}
