import { Injectable, type OnApplicationBootstrap } from '@nestjs/common'

import { PlateauCatalogService } from './plateau/PlateauCatalogService'

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(private readonly plateauCatalogService: PlateauCatalogService) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.plateauCatalogService.syncWithRemote()
  }
}
