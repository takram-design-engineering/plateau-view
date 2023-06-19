import path from 'path'
import { Module } from '@nestjs/common'

import { FirestoreModule } from '@takram/plateau-nest-firestore'
import { TileCacheModule } from '@takram/plateau-nest-tile-cache'
import { VectorTileModule } from '@takram/plateau-nest-vector-tile'

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
    VectorTileModule.forFeature({
      path: 'light',
      mapStyle: path.resolve(
        process.env.PROJECT_ROOT,
        'apps/app/public/assets/mapStyles/light.json'
      ),
      // This must be +1 of imagery layer's maximum level because tiles are
      // rendered with pixel ratio 2.
      maximumLevel: 23,
      nativeMaximumLevel: 16
    })
  ],
  controllers: [AppController]
})
export class AppModule {}
