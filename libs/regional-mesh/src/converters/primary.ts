import { decimal, modulo } from '../helpers'
import {
  type ConvertCodeToPoint,
  type ConvertPointToCode,
  type MeshPoint
} from '../types'

export const codeLength = 4
export const meshSize: Readonly<MeshPoint> = [3600 / 3600, 2400 / 3600]

export const convertPointToCode: ConvertPointToCode = point => {
  const value = modulo(point[1] * 60, 40)
  const p = value.quotient
  const { integer } = decimal(point[0] - 100)
  const u = integer
  return p * 100 + u * 1
}

export const convertCodeToPoint: ConvertCodeToPoint = code => {
  let value = modulo(code, 100)
  const p = value.quotient
  value = modulo(value.remainder, 1)
  const u = value.quotient
  return [((u + 100) * 3600) / 3600, (p * 2400) / 3600]
}
