import { csvParseRows } from 'd3'
import invariant from 'tiny-invariant'

import { inferMeshType, type MeshType } from '@takram/plateau-regional-mesh'

export interface ParseCSVOptions {
  codeColumn: number
  valueColumn: number
  skipHeader?: number
  fallbackValue?: number
}

export interface ParseCSVResult {
  meshType: MeshType
  codes: Float64Array
  values: Float32Array
  minValue: number
  maxValue: number
}

export function parseCSV(
  data: string,
  {
    codeColumn,
    valueColumn,
    skipHeader = 1,
    fallbackValue = 0
  }: ParseCSVOptions
): ParseCSVResult {
  let meshType: MeshType | undefined
  const codes: number[] = []
  const values: number[] = []
  let minValue = Infinity
  let maxValue = -Infinity
  csvParseRows(data, (row, index): undefined => {
    if (index <= skipHeader) {
      return
    }
    const code = +row[codeColumn]
    if (isNaN(code)) {
      return
    }
    codes.push(code)
    if (meshType == null) {
      meshType = inferMeshType(row[codeColumn])
    }
    let value = +row[valueColumn]
    if (isNaN(value)) {
      value = fallbackValue
    }
    values.push(value)
    if (value < minValue) {
      minValue = value
    }
    if (value > maxValue) {
      maxValue = value
    }
  })
  if (meshType == null) {
    throw new Error(`Could not infer mesh type: ${data}`)
  }
  invariant(codes.length > 0)
  invariant(values.length > 0)
  return {
    meshType,
    codes: new Float64Array(codes),
    values: new Float32Array(values),
    minValue,
    maxValue
  }
}
