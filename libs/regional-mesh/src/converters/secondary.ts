import { decimal, modulo } from '../helpers'
import {
  type ConvertCodeToPoint,
  type ConvertPointToCode,
  type MeshPoint
} from '../types'

export const codeLength = 6
export const meshSize: Readonly<MeshPoint> = [450 / 3600, 300 / 3600]

export const convertPointToCode: ConvertPointToCode = point => {
  let value = modulo(point[1] * 60, 40)
  const p = value.quotient
  value = modulo(value.remainder, 5)
  const q = value.quotient
  const { integer, fraction } = decimal(point[0] - 100)
  const u = integer
  value = modulo(fraction * 60, 7.5)
  const v = value.quotient
  return p * 10000 + u * 100 + q * 10 + v * 1
}

export const convertCodeToPoint: ConvertCodeToPoint = code => {
  let value = modulo(code, 10000)
  const p = value.quotient
  value = modulo(value.remainder, 100)
  const u = value.quotient
  value = modulo(value.remainder, 10)
  const q = value.quotient
  value = modulo(value.remainder, 1)
  const v = value.quotient
  return [((u + 100) * 3600 + v * 450) / 3600, (p * 2400 + q * 300) / 3600]
}
