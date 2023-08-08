import { decimal, modulo } from '../helpers'
import {
  type ConvertCodeToPoint,
  type ConvertPointToCode,
  type MeshPoint
} from '../types'

export const codeLength = 8
export const meshSize: Readonly<MeshPoint> = [45 / 3600, 30 / 3600]

export const convertPointToCode: ConvertPointToCode = point => {
  let value = modulo(point[1] * 60, 40)
  const p = value.quotient
  value = modulo(value.remainder, 5)
  const q = value.quotient
  value = modulo(value.remainder * 60, 30)
  const r = value.quotient
  const { integer, fraction } = decimal(point[0] - 100)
  const u = integer
  value = modulo(fraction * 60, 7.5)
  const v = value.quotient
  value = modulo(value.remainder * 60, 45)
  const w = value.quotient
  return p * 1000000 + u * 10000 + q * 1000 + v * 100 + r * 10 + w * 1
}

export const convertCodeToPoint: ConvertCodeToPoint = code => {
  let value = modulo(code, 1000000)
  const p = value.quotient
  value = modulo(value.remainder, 10000)
  const u = value.quotient
  value = modulo(value.remainder, 1000)
  const q = value.quotient
  value = modulo(value.remainder, 100)
  const v = value.quotient
  value = modulo(value.remainder, 10)
  const r = value.quotient
  value = modulo(value.remainder, 1)
  const w = value.quotient
  return [
    ((u + 100) * 3600 + v * 450 + w * 45) / 3600,
    (p * 2400 + q * 300 + r * 30) / 3600
  ]
}
