import { type MultiPolygon, type Polygon } from 'geojson'
import { chunk } from 'lodash'

export type ArrayObject<T> = Record<string, T | number> & {
  length: number
}

function toArrayObject<T>(array: readonly T[]): ArrayObject<T> {
  return array.reduce(
    (object, value, index) => ({ ...object, [`${index}`]: value }),
    { length: array.length }
  )
}

function mapArrayObject<T, U>(
  array: ArrayObject<T>,
  iterator: (item: T) => U
): U[] {
  return [...Array(array.length)].map((_, index) => {
    const item = array[`${index}`] as T // Index never be "length"
    return iterator(item)
  })
}

export type PackedGeometry =
  | {
      type: 'Polygon'
      coordinates: ArrayObject<Buffer>
    }
  | {
      type: 'MultiPolygon'
      coordinates: ArrayObject<ArrayObject<Buffer>>
    }

export function packGeometry(geometry: Polygon | MultiPolygon): PackedGeometry {
  if (geometry.type === 'Polygon') {
    return {
      type: 'Polygon',
      coordinates: toArrayObject(
        geometry.coordinates.flatMap(coordinates =>
          Buffer.from(new Float64Array(coordinates.flat()).buffer)
        )
      )
    }
  }
  return {
    type: 'MultiPolygon',
    coordinates: toArrayObject(
      geometry.coordinates.map(coordinates =>
        toArrayObject(
          coordinates.flatMap(coordinates =>
            Buffer.from(new Float64Array(coordinates.flat()).buffer)
          )
        )
      )
    )
  }
}

export function unpackGeometry(
  geometry: PackedGeometry
): Polygon | MultiPolygon {
  if (geometry.type === 'Polygon') {
    return {
      type: 'Polygon',
      coordinates: mapArrayObject(geometry.coordinates, buffer => {
        const array = [...new Float64Array(new Uint8Array(buffer).buffer)]
        if (array.length % 2 !== 0) {
          throw new Error(`Array length must be multiple of 2: ${array.length}`)
        }
        return chunk(array, 2)
      })
    }
  }
  return {
    type: 'MultiPolygon',
    coordinates: mapArrayObject(geometry.coordinates, coordinates =>
      mapArrayObject(coordinates, buffer => {
        const array = [...new Float64Array(new Uint8Array(buffer).buffer)]
        if (array.length % 2 !== 0) {
          throw new Error(`Array length must be multiple of 2: ${array.length}`)
        }
        return chunk(array, 2)
      })
    )
  }
}
