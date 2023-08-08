import invariant from 'tiny-invariant'

import * as basic from './converters/basic'
import * as eighth from './converters/eighth'
import * as half from './converters/half'
import * as primary from './converters/primary'
import * as quarter from './converters/quarter'
import * as secondary from './converters/secondary'
import { type MeshBounds, type MeshPoint } from './types'

const converters = {
  basic,
  eighth,
  half,
  primary,
  quarter,
  secondary
} as const

export type MeshType = keyof typeof converters

export type { MeshPoint, MeshBounds }

const meshTypesByCodeLength: Record<number, MeshType | undefined> =
  Object.entries(converters).reduce(
    (converters, [type, converter]) => ({
      ...converters,
      [converter.codeLength]: type
    }),
    {}
  )

export function inferMeshType(code: number): MeshType | undefined {
  if (code > 0x20000000000000) {
    // Cannot reliably express values above this in 64 bit floating point.
    return undefined
  }
  return meshTypesByCodeLength[`${code}`.length]
}

export function getMeshSize(meshType: MeshType): MeshPoint {
  return [...converters[meshType].meshSize]
}

export function getMeshCode(
  point: Readonly<MeshPoint>,
  meshType: MeshType
): string {
  return `${converters[meshType].convertPointToCode(point)}`
}

export function getMeshOrigin(code: number, meshType?: MeshType): MeshPoint {
  const converter = converters[meshType ?? (inferMeshType(code) as MeshType)]
  invariant(converter != null)
  return converter.convertCodeToPoint(+code)
}

export function getMeshCenter(code: number, meshType?: MeshType): MeshPoint {
  const converter = converters[meshType ?? (inferMeshType(code) as MeshType)]
  invariant(converter != null)
  const [x1, y1] = converter.convertCodeToPoint(+code)
  const [x2, y2] = converter.meshSize
  return [x1 + x2 / 2, y1 + y2 / 2]
}

export function getMeshBounds(code: number, meshType?: MeshType): MeshBounds {
  const converter = converters[meshType ?? (inferMeshType(code) as MeshType)]
  invariant(converter != null)
  const [x1, y1] = converter.convertCodeToPoint(+code)
  const [x2, y2] = converter.meshSize
  return [x1, y1, x1 + x2, y1 + y2]
}
