import invariant from 'tiny-invariant'

import { definitions } from './definitions'
import { type MeshPoint, type MeshType } from './types'

interface ConverterResult {
  code: string
  west: number
  south: number
}

type Converter = (point: MeshPoint) => ConverterResult

const converters: Record<MeshType, Converter> = {
  primary: point => {
    const west = Math.floor(point.longitude)
    const x = west - 100
    const y = Math.floor(point.latitude / definitions.primary.latitude)
    const code = `${100 * y + x}`
    const south = y * definitions.primary.latitude
    return { code, west, south }
  },

  secondary: point => {
    const parent = converters.primary(point)
    const unit = definitions.secondary
    const x = Math.floor((point.longitude - parent.west) / unit.longitude)
    const y = Math.floor((point.latitude - parent.south) / unit.latitude)
    const code = `${parent.code}${y}${x}`
    const west = parent.west + x * unit.longitude
    const south = parent.south + y * unit.latitude
    return { code, west, south }
  },

  tertiary: point => {
    const parent = converters.secondary(point)
    const unit = definitions.tertiary
    const x = Math.floor((point.longitude - parent.west) / unit.longitude)
    const y = Math.floor((point.latitude - parent.south) / unit.latitude)
    const code = `${parent.code}${y}${x}`
    const west = parent.west + x * unit.longitude
    const south = parent.south + y * unit.latitude
    return { code, west, south }
  },

  half: point => {
    const parent = converters.tertiary(point)
    const unit = definitions.half
    const x = Math.floor((point.longitude - parent.west) / unit.longitude)
    const y = Math.floor((point.latitude - parent.south) / unit.latitude)
    const code = `${parent.code}${2 * y + x + 1}`
    const west = parent.west + x * unit.longitude
    const south = parent.south + y * unit.latitude
    return { code, west, south }
  },

  quarter: point => {
    const parent = converters.half(point)
    const unit = definitions.quarter
    const x = Math.floor((point.longitude - parent.west) / unit.longitude)
    const y = Math.floor((point.latitude - parent.south) / unit.latitude)
    const code = `${parent.code}${2 * y + x + 1}`
    const west = parent.west + x * unit.longitude
    const south = parent.south + y * unit.latitude
    return { code, west, south }
  },

  eighth: point => {
    const parent = converters.quarter(point)
    const unit = definitions.eighth
    const x = Math.floor((point.longitude - parent.west) / unit.longitude)
    const y = Math.floor((point.latitude - parent.south) / unit.latitude)
    const code = `${parent.code}${2 * y + x + 1}`
    const west = parent.west + x * unit.longitude
    const south = parent.south + y * unit.latitude
    return { code, west, south }
  }
}

export function convertPointToCode(
  point: MeshPoint,
  meshType: MeshType
): string {
  const { longitude, latitude } = point
  if (latitude < 0 || latitude >= 66.66) {
    throw new RangeError(`Latitude out of bounds: ${latitude}`)
  }
  if (longitude < 100 || longitude >= 180) {
    throw new RangeError(`Longitude out of bounds: ${longitude}`)
  }
  const converter = converters[meshType]
  if (converter == null) {
    throw new Error(`Unsupported mesh type: ${meshType}`)
  }
  const { code } = converter(point)
  invariant(code.length === definitions[meshType].codeLength)
  return code
}
