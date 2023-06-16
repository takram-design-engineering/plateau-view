import { Module } from '@nestjs/common'
import path from 'path'

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
      cacheRoot: process.env.TILE_CACHE_ROOT
    }),
    VectorTileModule.forRoot({}),
    VectorTileModule.forFeature({
      path: 'light',
      mapStyle: path.resolve(
        process.env.PROJECT_ROOT,
        'apps/app/public/assets/mapStyles/light.json'
      ),
      maximumLevel: 22,
      nativeMaximumLevel: 16
    })
  ],
  controllers: [AppController]
})
export class AppModule {}
