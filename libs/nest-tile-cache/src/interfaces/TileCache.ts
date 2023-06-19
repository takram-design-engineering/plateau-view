import { type Readable } from 'stream'
import { type Sharp } from 'sharp'

import { type Coordinates } from './Coordinates'
import { type TileFormat } from './TileFormat'

export interface TileCache {
  get: (
    name: string,
    coords: Coordinates,
    format: TileFormat
  ) => Promise<Readable | string | undefined>
  set: (
    name: string,
    coords: Coordinates,
    format: TileFormat,
    image: Sharp
  ) => Promise<void>
}
