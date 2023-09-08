import { type Zxy } from 'protomaps'

import { type ImageryCoords } from './types'

export function makeKey({ x, y, level }: ImageryCoords): string {
  return `${level}:${x}:${y}`
}

export function getTileCoords(coords: ImageryCoords): Zxy {
  if (coords.level > 17) {
    throw new Error(`Levels must be below or equal to 17: ${coords.level}`)
  }
  // Tiles at 16 level includes features for level 17.
  // https://github.com/gsi-cyberjapan/optimal_bvmap
  return coords.level === 17
    ? {
        x: Math.floor(coords.x / 2),
        y: Math.floor(coords.y / 2),
        z: 16
      }
    : {
        x: coords.x,
        y: coords.y,
        z: coords.level
      }
}
