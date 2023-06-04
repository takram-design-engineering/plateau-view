import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ServeStaticModule } from '@nestjs/serve-static'
import * as envalid from 'envalid'
import path from 'path'

import { FirestoreModule } from '@takram/plateau-nest-firestore'
import { PlateauModule } from '@takram/plateau-nest-plateau'
import { TerrainTileModule } from '@takram/plateau-nest-terrain-tile'
import { TileCacheModule } from '@takram/plateau-nest-tile-cache'

import { AppController } from './AppController'
import { AppService } from './AppService'

const env = envalid.cleanEnv(process.env, {
  DATA_BASE_URL: envalid.url(),
  DATA_STORAGE_ROOT: envalid.str()
})

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      cache: 'bounded',
      path: 'graphql',
      useGlobalPrefix: true,
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      sortSchema: true
    }),
    FirestoreModule.forRoot({
      rootPath: 'api'
    }),
    PlateauModule.forRoot({
      baseUrl: env.DATA_BASE_URL,
      storageRoot: env.DATA_STORAGE_ROOT
    }),
    TileCacheModule.forRoot({
      cacheRoot: process.env.TILE_CACHE_ROOT
    }),
    TerrainTileModule.forRoot({
      path: 'terrain'
    }),

    // Serve static files for development; these routes are behind our path
    // matcher in production.
    ServeStaticModule.forRoot({
      rootPath: path.resolve(process.env.PROJECT_ROOT, 'data'),
      serveRoot: '/data'
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(
        process.env.PROJECT_ROOT,
        'node_modules/@cesium/engine/Build/Workers'
      ),
      serveRoot: '/cesium/Workers'
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(
        process.env.PROJECT_ROOT,
        'node_modules/@cesium/engine/Source/Assets'
      ),
      serveRoot: '/cesium/Assets'
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(
        process.env.PROJECT_ROOT,
        'node_modules/@cesium/engine/Source/ThirdParty'
      ),
      serveRoot: '/cesium/ThirdParty'
    })
  ],
  providers: [AppService],
  controllers: [AppController]
})
export class AppModule {}
