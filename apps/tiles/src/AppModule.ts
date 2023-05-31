import { Module } from '@nestjs/common'
import path from 'path'

import { VectorTileModule } from '@takram/plateau-nest-vector-tile'

import { AppController } from './AppController'

@Module({
  imports: [
    VectorTileModule.forRoot({
      cacheRoot: process.env.TILE_CACHE_ROOT
    }),
    VectorTileModule.forFeature({
      path: 'light',
      mapStyle: path.resolve(
        process.env.PROJECT_ROOT,
        'apps/app/public/assets/mapStyles/light.json'
      ),
      maximumLevel: 24,
      nativeMaximumLevel: 16
    })
  ],
  controllers: [AppController]
})
export class AppModule {}
