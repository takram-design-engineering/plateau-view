import { atom, type PrimitiveAtom } from 'jotai'
import { splitAtom } from 'jotai/utils'

import { type SplitAtom } from '@takram/plateau-type-helpers'

export interface QualitativeColor {
  value: string | number
  color: string
  name: string
}

export interface QualitativeColorSet {
  type: 'qualitative'
  name: string
  colorsAtom: PrimitiveAtom<QualitativeColor[]>
  colorAtomsAtom: SplitAtom<QualitativeColor>
}

export interface QualitativeColorSetOptions {
  name: string
  colors: readonly QualitativeColor[]
}

export function atomsWithQualitativeColorSet({
  name,
  colors
}: QualitativeColorSetOptions): QualitativeColorSet {
  const colorsAtom = atom([...colors])
  const colorAtomsAtom = splitAtom(colorsAtom)
  return {
    type: 'qualitative',
    name,
    colorsAtom,
    colorAtomsAtom
  }
}
