import { Injectable, Logger, type OnApplicationBootstrap } from '@nestjs/common'

import { PlateauDatasetsService } from './plateau/PlateauDatasetsService'

@Injectable()
export class AppService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AppService.name)

  constructor(
    private readonly plateauDatasetsService: PlateauDatasetsService
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    // Don't wait this for complete.
    // TODO: Don't sync in every bootstrap.
    this.plateauDatasetsService.syncWithRemote().catch(error => {
      this.logger.error(`Error during syncWithRemote: ${error.message}`)
    })
  }
}
