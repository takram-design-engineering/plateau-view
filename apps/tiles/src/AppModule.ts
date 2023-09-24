import { Module } from '@nestjs/common'

import { FirestoreModule } from '@takram/plateau-nest-firestore'
import { TileCacheModule } from '@takram/plateau-nest-tile-cache'
import { VectorTileModule } from '@takram/plateau-nest-vector-tile'
import { darkStyle, lightStyle } from '@takram/plateau-vector-map-style'

import { AppController } from './AppController'

@Module({
  imports: [
    FirestoreModule.forRoot({
      rootPath: 'api'
    }),
    TileCacheModule.forRoot({
      cacheRoot:
        process.env.TILE_CACHE_ROOT !== ''
          ? process.env.TILE_CACHE_ROOT
          : undefined
    }),
    VectorTileModule.forRoot({
      disableCache:
        process.env.TILE_CACHE_ROOT == null ||
        process.env.TILE_CACHE_ROOT === ''
    }),
    // maximumLevel must be +1 of imagery layer's maximum level because tiles
    // are rendered with pixel ratio 2.
    VectorTileModule.forFeature({
      path: 'light-map',
      mapStyle: lightStyle,
      maximumLevel: 23,
      minimumDataLevel: 4,
      maximumDataLevel: 16
    }),
    VectorTileModule.forFeature({
      path: 'dark-map',
      mapStyle: darkStyle,
      maximumLevel: 23,
      minimumDataLevel: 4,
      maximumDataLevel: 16
    })
  ],
  controllers: [AppController]
})
export class AppModule {}
