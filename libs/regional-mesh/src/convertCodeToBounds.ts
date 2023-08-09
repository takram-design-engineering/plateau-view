import { definitions } from './definitions'
import { type MeshBounds, type MeshPoint, type MeshType } from './types'

interface ConverterResult {
  west: number
  south: number
  unit: MeshPoint
}

type Converter = (code: string) => ConverterResult

const converters: Record<MeshType, Converter> = {
  primary: code => {
    const x = +code.slice(2, 4)
    const y = +code.slice(0, 2)
    const unit = definitions.primary
    const west = x * unit.longitude + 100
    const south = y * unit.latitude
    return { west, south, unit }
  },

  secondary: code => {
    const parent = converters.primary(code)
    const x = +code[5]
    const y = +code[4]
    const unit = definitions.secondary
    const west = parent.west + x * unit.longitude
    const south = parent.south + y * unit.latitude
    return { west, south, unit }
  },

  tertiary: code => {
    const parent = converters.secondary(code)
    const x = +code[7]
    const y = +code[6]
    const unit = definitions.tertiary
    const west = parent.west + x * unit.longitude
    const south = parent.south + y * unit.latitude
    return { west, south, unit }
  },

  half: code => {
    const parent = converters.tertiary(code)
    const c = +code[8] - 1
    const x = c % 2
    const y = Math.floor(c / 2)
    const unit = definitions.half
    const west = parent.west + x * unit.longitude
    const south = parent.south + y * unit.latitude
    return { west, south, unit }
  },

  quarter: code => {
    const parent = converters.half(code)
    const c = +code[9] - 1
    const x = c % 2
    const y = Math.floor(c / 2)
    const unit = definitions.quarter
    const west = parent.west + x * unit.longitude
    const south = parent.south + y * unit.latitude
    return { west, south, unit }
  },

  eighth: code => {
    const parent = converters.quarter(code)
    const c = +code[10] - 1
    const x = c % 2
    const y = Math.floor(c / 2)
    const unit = definitions.eighth
    const west = parent.west + x * unit.longitude
    const south = parent.south + y * unit.latitude
    return { west, south, unit }
  }
}

export function convertCodeToBounds(
  code: string,
  meshType: MeshType
): MeshBounds {
  const converter = converters[meshType]
  if (converter == null) {
    throw new Error(`Unsupported mesh type: ${meshType}`)
  }
  const { codeLength } = definitions[meshType]
  if (code.length !== codeLength) {
    throw new Error(`Expected code length to ${codeLength}: ${code.length}`)
  }
  const { south, west, unit } = converter(code)
  const east = west + unit.longitude
  const north = south + unit.latitude
  return { north, west, south, east }
}
