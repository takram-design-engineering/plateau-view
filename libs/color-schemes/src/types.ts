export type ColorTuple = [number, number, number]
export type LUT = readonly ColorTuple[]

export interface QualitativeColor {
  value: string | number
  color: string
  name: string
}
