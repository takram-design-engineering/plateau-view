import { Storage, type Bucket } from '@google-cloud/storage'
import { Injectable } from '@nestjs/common'
import path from 'path'
import { type Sharp } from 'sharp'
import { type Readable } from 'stream'
import invariant from 'tiny-invariant'

import { type Coordinates } from '../interfaces/Coordinates'
import { type VectorTileCache } from '../interfaces/VectorTileCache'
import { type VectorTileRenderFormat } from '../interfaces/VectorTileFormat'

@Injectable()
export class BucketCache implements VectorTileCache {
  private readonly storage = new Storage()
  private readonly bucket: Bucket
  private readonly bucketRoot: string // TODO: Use bucket root in paths

  constructor(cacheRoot: string) {
    const url = new URL(cacheRoot)
    invariant(url.protocol === 'gs:')
    this.bucket = this.storage.bucket(url.host)
    this.bucketRoot = url.pathname
  }

  private makePath(
    name: string,
    coords: Coordinates,
    format: VectorTileRenderFormat
  ): string {
    const { x, y, level } = coords
    return path.join(name, `${level}/${x}/${y}.${format}`)
  }

  async get(
    name: string,
    coords: Coordinates,
    format: VectorTileRenderFormat
  ): Promise<string | Readable | undefined> {
    const file = this.bucket.file(this.makePath(name, coords, format))
    const [exists] = await file.exists()
    return exists ? file.createReadStream() : undefined
  }

  async set(
    name: string,
    coords: Coordinates,
    format: VectorTileRenderFormat,
    image: Sharp
  ): Promise<void> {
    const file = this.bucket.file(this.makePath(name, coords, format))
    await new Promise((resolve, reject) => {
      image
        .pipe(file.createWriteStream())
        .on('close', resolve)
        .on('error', error => {
          reject(error)
        })
    })
  }
}
