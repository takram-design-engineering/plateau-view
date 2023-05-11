import { type Sharp } from 'sharp'
import { type Readable } from 'stream'

import { type Coordinates } from './Coordinates'
import { type VectorTileRenderFormat } from './VectorTileFormat'

export interface VectorTileCache {
  get: (
    name: string,
    coords: Coordinates,
    format: VectorTileRenderFormat
  ) => Promise<Readable | string | undefined>
  set: (
    name: string,
    coords: Coordinates,
    format: VectorTileRenderFormat,
    image: Sharp
  ) => Promise<void>
}
