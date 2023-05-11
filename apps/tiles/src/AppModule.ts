import { Module } from '@nestjs/common'
import path from 'path'

import { VectorTileModule } from '@plateau/nest-vector-tile'

import { AppController } from './AppController'

@Module({
  imports: [
    VectorTileModule.forRoot({
      cacheRoot: process.env.VECTOR_TILE_CACHE_ROOT
    }),
    VectorTileModule.forFeature({
      path: 'light',
      mapStyle: path.resolve(
        process.env.PROJECT_ROOT,
        'apps/app/public/assets/map-styles/light.json'
      ),
      maximumLevel: 24,
      nativeMaximumLevel: 16
    })
  ],
  controllers: [AppController]
})
export class AppModule {}