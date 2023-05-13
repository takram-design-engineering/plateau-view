import './env'

import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './AppModule'

const port =
  process.env.PORT != null && !isNaN(+process.env.PORT)
    ? +process.env.PORT
    : 3000

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.setGlobalPrefix('api', { exclude: ['/'] })
  app.enableCors({
    origin:
      process.env.CORS_ORIGIN != null
        ? process.env.CORS_ORIGIN.split(' ')
        : '*',
    methods: ['GET'],
    maxAge: 3600
  })

  await app.listen(port)
  Logger.log(`Listening on ${port}.`)
}

bootstrap().catch(error => {
  Logger.error('Error during bootstrap.', error)
  process.exit(1)
})

process.on('uncaughtException', error => {
  Logger.error('Uncaught exception', error)
  process.exit(1)
})
