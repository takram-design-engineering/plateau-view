import { List } from '@mui/material'
import { useAtomValue } from 'jotai'
import { type FC } from 'react'

import { type QualitativeColorSet } from '@takram/plateau-datasets'

import { ColorSetListItem } from './ColorSetListItem'

export const ColorSetList: FC<{
  colorsAtom: QualitativeColorSet['colorAtomsAtom']
}> = ({ colorsAtom }) => {
  const colorsAtoms = useAtomValue(colorsAtom)
  return (
    <List disablePadding>
      {colorsAtoms.map(colorAtom => (
        <ColorSetListItem key={`${colorAtom}`} colorAtom={colorAtom} />
      ))}
    </List>
  )
}
