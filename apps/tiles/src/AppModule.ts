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
      // TODO: Enable cache on merging to main.
      // cacheRoot:
      //   process.env.TILE_CACHE_ROOT !== ''
      //     ? process.env.TILE_CACHE_ROOT
      //     : undefined
    }),
    VectorTileModule.forRoot({
      // TODO: Enable cache on merging to main.
      // disableCache:
      //   process.env.TILE_CACHE_ROOT == null ||
      //   process.env.TILE_CACHE_ROOT === ''
      disableCache: true
    }),
    // maximumLevel must be +1 of imagery layer's maximum level because tiles
    // are rendered with pixel ratio 2.
    VectorTileModule.forFeature({
      path: 'light',
      mapStyle: lightStyle,
      maximumLevel: 23,
      nativeMaximumLevel: 16
    }),
    VectorTileModule.forFeature({
      path: 'dark',
      mapStyle: darkStyle,
      maximumLevel: 23,
      nativeMaximumLevel: 16
    })
  ],
  controllers: [AppController]
})
export class AppModule {}
