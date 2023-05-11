import {
  type MapOptions,
  type RequestResponse,
  type ResourceKind
} from '@maplibre/maplibre-gl-native'
import { Global, Module } from '@nestjs/common'
import axios, { isAxiosError } from 'axios'

import { BucketCache } from './caches/BucketCache'
import { FileCache } from './caches/FileCache'
import {
  VECTOR_TILE_CACHE,
  VECTOR_TILE_MAP_OPTIONS,
  VECTOR_TILE_MODULE_OPTIONS
} from './constants'
import { type VectorTileModuleOptions } from './interfaces/VectorTileModuleOptions'
import {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN
} from './moduleDefinitions'

interface MapRequest {
  url: string
  kind: ResourceKind
}

async function handleRequest(req: MapRequest): Promise<RequestResponse> {
  try {
    const { data: arrayBuffer } = await axios<ArrayBuffer>(req.url, {
      responseType: 'arraybuffer'
    })
    return {
      data: Buffer.from(arrayBuffer)
    }
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return {
        data: Buffer.alloc(0)
      }
    }
    throw error
  }
}

@Global()
@Module({
  providers: [
    {
      provide: VECTOR_TILE_MODULE_OPTIONS,
      useFactory: (options: VectorTileModuleOptions) => options,
      inject: [MODULE_OPTIONS_TOKEN]
    },
    {
      provide: VECTOR_TILE_CACHE,
      useFactory: ({ useCache = true, cacheRoot }: VectorTileModuleOptions) => {
        if (!useCache || cacheRoot == null) {
          return undefined
        }
        return cacheRoot.startsWith('gs://')
          ? new BucketCache(cacheRoot)
          : new FileCache(cacheRoot)
      },
      inject: [MODULE_OPTIONS_TOKEN]
    },
    {
      provide: VECTOR_TILE_MAP_OPTIONS,
      useFactory: (): MapOptions => ({
        request: (req, callback) => {
          handleRequest(req)
            .then(response => {
              callback(undefined, response)
            })
            .catch(error => {
              callback(error)
            })
        }
      })
    }
  ],
  exports: [
    VECTOR_TILE_MODULE_OPTIONS,
    VECTOR_TILE_CACHE,
    VECTOR_TILE_MAP_OPTIONS
  ]
})
export class VectorTileCoreModule extends ConfigurableModuleClass {}
