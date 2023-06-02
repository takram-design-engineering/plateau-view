import { Firestore } from '@google-cloud/firestore'
import { Inject, Injectable } from '@nestjs/common'
import { type Sharp } from 'sharp'
import { type Readable } from 'stream'
import invariant from 'tiny-invariant'

import { FIRESTORE } from '@takram/plateau-nest-firestore'

import { TILE_CACHE } from './constants'
import { type Coordinates } from './interfaces/Coordinates'
import { type TileCache } from './interfaces/TileCache'
import { type TileFormat } from './interfaces/TileFormat'

export interface CachedTileRendererOptions {
  cache: TileCache | undefined
  path: string
  maximumLevel: number
}

export interface RenderTileOptions {
  format?: TileFormat
}

function applyFormat(image: Sharp, format: TileFormat): Sharp {
  return format === 'webp' ? image.webp({ lossless: true }) : image.png()
}

function makeDocumentId(path: string, { x, y, level }: Coordinates): string {
  return `tiles/${path}/discarded/${level}:${x}:${y}`
}

function getParents(coords: Coordinates): Coordinates[] {
  const x = coords.x / 2 ** coords.level
  const y = coords.y / 2 ** coords.level
  const parents: Coordinates[] = []
  for (let level = coords.level - 1; level >= 0; --level) {
    const n = 2 ** level
    parents.push({ x: Math.floor(x * n), y: Math.floor(y * n), level })
  }
  return parents
}

@Injectable()
export class TileCacheService {
  constructor(
    @Inject(TILE_CACHE)
    private readonly cache: TileCache | undefined,
    @Inject(FIRESTORE)
    private readonly firestore: Firestore
  ) {}

  async findOne(
    path: string,
    coords: Coordinates,
    { format = 'webp' }: RenderTileOptions = {}
  ): Promise<Readable | string | undefined> {
    return this.cache != null
      ? await this.cache.get(path, coords, format)
      : undefined
  }

  async createOne(
    image: Sharp,
    path: string,
    coords: Coordinates,
    { format = 'webp' }: RenderTileOptions = {}
  ): Promise<Sharp | Readable | string | undefined> {
    if (this.cache != null) {
      ;(async () => {
        invariant(this.cache != null)
        await this.cache.set(path, coords, format, applyFormat(image, format))
      })().catch(error => {
        console.error(error)
      })
    }
    return applyFormat(image, format)
  }

  async isDiscarded(path: string, coords: Coordinates): Promise<boolean> {
    const docs = await this.firestore.getAll(
      ...[coords, ...getParents(coords)].map(coords =>
        this.firestore.doc(makeDocumentId(path, coords))
      )
    )
    return docs.some(doc => doc.exists)
  }

  async discardOne(path: string, coords: Coordinates): Promise<void> {
    const doc = await this.firestore.doc(makeDocumentId(path, coords)).get()
    if (doc.exists) {
      return
    }
    await doc.ref.set({ path, ...coords })
  }
}
