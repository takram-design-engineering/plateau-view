import { decimal, modulo } from '../helpers'
import {
  type ConvertCodeToPoint,
  type ConvertPointToCode,
  type MeshPoint
} from '../types'

export const codeLength = 10
export const meshSize: Readonly<MeshPoint> = [11.25 / 3600, 7.5 / 3600]

export const convertPointToCode: ConvertPointToCode = point => {
  let value = modulo(point[1] * 60, 40)
  const p = value.quotient
  value = modulo(value.remainder, 5)
  const q = value.quotient
  value = modulo(value.remainder * 60, 30)
  const r = value.quotient
  value = modulo(value.remainder, 15)
  const s = value.quotient
  value = modulo(value.remainder, 7.5)
  const t = value.quotient
  const { integer, fraction } = decimal(point[0] - 100)
  const u = integer
  value = modulo(fraction * 60, 7.5)
  const v = value.quotient
  value = modulo(value.remainder * 60, 45)
  const w = value.quotient
  value = modulo(value.remainder, 22.5)
  const x = value.quotient
  value = modulo(value.remainder, 11.25)
  const y = value.quotient
  const m = s * 2 + x + 1
  const n = t * 2 + y + 1
  return (
    p * 100000000 +
    u * 1000000 +
    q * 100000 +
    v * 10000 +
    r * 1000 +
    w * 100 +
    m * 10 +
    n * 1
  )
}

export const convertCodeToPoint: ConvertCodeToPoint = code => {
  let value = modulo(code, 100000000)
  const p = value.quotient
  value = modulo(value.remainder, 1000000)
  const u = value.quotient
  value = modulo(value.remainder, 100000)
  const q = value.quotient
  value = modulo(value.remainder, 10000)
  const v = value.quotient
  value = modulo(value.remainder, 1000)
  const r = value.quotient
  value = modulo(value.remainder, 100)
  const w = value.quotient
  value = modulo(value.remainder, 10)
  const m = value.quotient
  value = modulo(value.remainder, 1)
  const n = value.quotient
  const s = (m - 1) >> 1
  const x = (m - 1) & 1
  const t = (n - 1) >> 1
  const y = (n - 1) & 1
  return [
    ((u + 100) * 3600 + v * 450 + w * 45 + x * 22.5 + y * 11.25) / 3600,
    (p * 2400 + q * 300 + r * 30 + s * 15 + t * 7.5) / 3600
  ]
}
