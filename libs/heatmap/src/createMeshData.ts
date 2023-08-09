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
    const { west, south } = convertCodeToBounds(`${code}`, meshType)
    xs[index] = west
    ys[index] = south
    if (west < x1) x1 = west
    if (west > x2) x2 = west
    if (south < y1) y1 = south
    if (south > y2) y2 = south
  })
  const { longitude, latitude } = getMeshSize(meshType)
  x2 += longitude
  y2 += latitude
  const width = Math.round((x2 - x1) / longitude)
  const height = Math.round((y2 - y1) / latitude)
  const data = new Uint8ClampedArray(width * height * 4)
  for (let i = 0; i < data.length; i += 4) {
    data[i + 2] = 0x80
    data[i + 3] = 0xff
  }
  values.forEach((value, index) => {
    const dx = xs[index]
    const dy = ys[index]
    const x = Math.round((dx - x1) / longitude)
    const y = height - Math.round((dy - y1) / latitude) - 1
    const i = (y * width + x) * 4
    // TODO: Make use of 32 bit. Due to premultiplied alpha which cannot be
    // turned off using Canvas API, alpha component affect other components.
    const scaledValue = Math.round(value / scale)
    invariant(scaledValue <= MAX_VALUE && scaledValue >= MIN_VALUE)
    const v = scaledValue + 0x800000
    data[i + 0] = v & 0xff
    data[i + 1] = (v >>> 8) & 0xff
    data[i + 2] = (v >>> 16) & 0xff
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
