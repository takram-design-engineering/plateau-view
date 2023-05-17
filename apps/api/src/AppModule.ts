import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ServeStaticModule } from '@nestjs/serve-static'
import * as envalid from 'envalid'
import path from 'path'

import { FirestoreModule } from '@plateau/nest-firestore'
import { PlateauModule } from '@plateau/nest-plateau'

import { AppController } from './AppController'
import { AppService } from './AppService'

const env = envalid.cleanEnv(process.env, {
  DATA_BASE_URL: envalid.url(),
  DATA_STORAGE_ROOT: envalid.url({
    devDefault: path.resolve(process.env.PROJECT_ROOT, 'data')
  })
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

    // Serve static files for development; these routes are behind our path
    // matcher in production.
    ...(process.env.NODE_ENV !== 'production'
      ? [
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
        ]
      : [])
  ],
  providers: [AppService],
  controllers: [AppController]
})
export class AppModule {}
