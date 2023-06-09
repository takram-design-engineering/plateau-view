import { Injectable, Logger, type OnApplicationBootstrap } from '@nestjs/common'

import { PlateauCatalogService } from '@takram/plateau-nest-plateau'

@Injectable()
export class AppService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AppService.name)

  constructor(private readonly plateauDatasetsService: PlateauCatalogService) {}

  async onApplicationBootstrap(): Promise<void> {
    // Don't wait this for complete.
    // TODO: Don't sync in every bootstrap.
    // this.plateauDatasetsService.syncWithRemote().catch(error => {
    //   this.logger.error(`Error during syncWithRemote: ${error.message}`)
    // })
  }
}
