import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import path from 'path'

import { AppController } from './AppController'

@Module({
  imports: [
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
  controllers: [AppController]
})
export class AppModule {}
