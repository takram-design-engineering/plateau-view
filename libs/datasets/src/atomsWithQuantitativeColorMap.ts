import { atom, type PrimitiveAtom } from 'jotai'

import { colorMapPlateau, type ColorMap } from '@takram/plateau-color-maps'

export interface QuantitativeColorMap {
  type: 'quantitative'
  name: string
  colorMapAtom: PrimitiveAtom<ColorMap>
  colorRangeAtom: PrimitiveAtom<number[]>
  valueRangeAtom: PrimitiveAtom<number[]>
}

export interface QuantitativeColorSetOptions {
  name: string
  colorMap?: ColorMap
  colorRange?: number[]
  valueRange?: number[]
}

export function atomsWithQuantitativeColorMap({
  name,
  colorMap = colorMapPlateau,
  colorRange = [0, 100],
  valueRange = colorRange
}: QuantitativeColorSetOptions): QuantitativeColorMap {
  const colorMapAtom = atom(colorMap)
  const colorRangeAtom = atom(colorRange)
  const valueRangeAtom = atom(valueRange)
  return {
    type: 'quantitative',
    name,
    colorMapAtom,
    colorRangeAtom,
    valueRangeAtom
  }
}
