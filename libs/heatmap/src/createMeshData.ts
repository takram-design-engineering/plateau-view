import invariant from 'tiny-invariant'

import {
  convertCodeToBounds,
  getMeshSize,
  type MeshBounds,
  type MeshType
} from '@takram/plateau-regional-mesh'

export const MAX_VALUE = 0x7fffff
export const MIN_VALUE = -0x800000

export interface MeshDataInput {
  codes: Float64Array
  values: Float32Array
  meshType: MeshType
  scale?: number
}

export interface MeshData {
  data: Uint8ClampedArray
  width: number
  height: number
  bounds: MeshBounds
}

export function createMeshData({
  codes,
  values,
  meshType,
  scale = 1
}: MeshDataInput): MeshData {
  invariant(codes.length === values.length)
  const xs = new Float32Array(codes.length)
  const ys = new Float32Array(codes.length)
  let x1 = Infinity
  let y1 = Infinity
  let x2 = -Infinity
  let y2 = -Infinity
  codes.forEach((code, index) => {
    const bounds = convertCodeToBounds(`${code}`, meshType)
    xs[index] = bounds.west
    ys[index] = bounds.south
    if (bounds.west < x1) x1 = bounds.west
    if (bounds.east > x2) x2 = bounds.east
    if (bounds.south < y1) y1 = bounds.south
    if (bounds.north > y2) y2 = bounds.north
  })
  const { longitude, latitude } = getMeshSize(meshType)
  const width = Math.round((x2 - x1) / longitude)
  const height = Math.round((y2 - y1) / latitude)
  const data = new Uint8ClampedArray(width * height * 4)
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 0x80
    // Denotes N/A. Because Canvas API doesn't allow us to turn off
    // premultiplied alpha, alpha components must not be zero. This will alter
    // the colors but not much.
    data[i + 3] = 0x80
  }
  values.forEach((value, index) => {
    const x = Math.round((xs[index] - x1) / longitude)
    const y = height - Math.round((ys[index] - y1) / latitude) - 1
    const i = (y * width + x) * 4
    const scaledValue = Math.round(value * scale)
    if (scaledValue > MAX_VALUE || scaledValue < MIN_VALUE) {
      throw new Error(
        `Value must be within MIN_VALUE and MAX_VALUE: value = ${value}, scale = ${scale}`
      )
    }
    const v = scaledValue + 0x800000
    // Note that the buffer order is ABGR.
    data[i] = (v >>> 16) & 0xff
    data[i + 1] = (v >>> 8) & 0xff
    data[i + 2] = v & 0xff
    data[i + 3] = 0xff
  })
  return {
    data,
    width,
    height,
    bounds: {
      west: x1,
      south: y1,
      east: x2,
      north: y2
    }
  }
}
