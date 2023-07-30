import { List } from '@mui/material'
import { useAtomValue, type PrimitiveAtom } from 'jotai'
import { type FC } from 'react'

import { type QualitativeColor } from '@takram/plateau-color-schemes'

import { ColorListItem } from './ColorListItem'

export const ColorList: FC<{
  atom: PrimitiveAtom<Array<PrimitiveAtom<QualitativeColor>>>
}> = ({ atom }) => {
  const itemAtoms = useAtomValue(atom)
  return (
    <List disablePadding>
      {itemAtoms.map(atom => (
        <ColorListItem key={`${atom}`} atom={atom} />
      ))}
    </List>
  )
}
