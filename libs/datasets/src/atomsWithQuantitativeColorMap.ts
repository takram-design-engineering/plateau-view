import { atom, type PrimitiveAtom } from 'jotai'

import { colorMapPlateau, type ColorMap } from '@takram/plateau-color-maps'

export interface QuantitativeColorMap {
  type: 'quantitative'
  name: string
  colorMapAtom: PrimitiveAtom<ColorMap>
  colorRangeAtom: PrimitiveAtom<number[]>
}

export interface QuantitativeColorSetOptions {
  name: string
  colorMap?: ColorMap
  colorRange?: number[]
}

export function atomsWithQuantitativeColorMap({
  name,
  colorMap,
  colorRange
}: QuantitativeColorSetOptions): QuantitativeColorMap {
  const colorMapAtom = atom(colorMap ?? colorMapPlateau)
  const colorRangeAtom = atom(colorRange ?? [0, 100])
  return {
    type: 'quantitative',
    name,
    colorMapAtom,
    colorRangeAtom
  }
}
