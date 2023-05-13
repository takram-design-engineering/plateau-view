import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ServeStaticModule } from '@nestjs/serve-static'
import * as envalid from 'envalid'
import path from 'path'

import { FirestoreModule } from '@plateau/nest-firestore'

import { AppController } from './AppController'
import { AppService } from './AppService'
import { PlateauModule } from './plateau/PlateauModule'

const env = envalid.cleanEnv(process.env, {
  DATA_ROOT: envalid.str()
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
      dataRoot: env.DATA_ROOT
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
