import { createReadStream } from 'fs'
import { open } from 'fs/promises'
import path from 'path'
import { type Readable } from 'stream'
import { mkdirp } from 'mkdirp'
import { type Sharp } from 'sharp'

import { type Coordinates } from './interfaces/Coordinates'
import { type TileCache } from './interfaces/TileCache'
import { type TileFormat } from './interfaces/TileFormat'

export class FileCache implements TileCache {
  constructor(private readonly cacheRoot: string) {}

  private makePath(
    name: string,
    coords: Coordinates,
    format: TileFormat
  ): string {
    const { x, y, level } = coords
    return path.resolve(this.cacheRoot, name, `${level}/${x}/${y}.${format}`)
  }

  async get(
    name: string,
    coords: Coordinates,
    format: TileFormat
  ): Promise<string | Readable | undefined> {
    try {
      return createReadStream('', {
        fd: await open(this.makePath(name, coords, format), 'r')
      })
    } catch (error) {}
    return undefined
  }

  async set(
    name: string,
    coords: Coordinates,
    format: TileFormat,
    image: Sharp
  ): Promise<void> {
    const cachePath = this.makePath(name, coords, format)
    await mkdirp(path.dirname(cachePath))
    await image.toFile(cachePath)
  }
}
