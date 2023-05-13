import { CollectionReference, Firestore } from '@google-cloud/firestore'
import { Inject, Injectable, Logger } from '@nestjs/common'
import axios from 'axios'
import { validate, type Schema } from 'jtd'

import { FIRESTORE } from '@plateau/nest-firestore'

import schema from '../assets/plateau-2022.jtd.json'
import { PlateauCatalogDataset } from './dto/PlateauCatalogDataset'
import { type PlateauCatalog } from './schemas/catalog'

@Injectable()
export class PlateauCatalogService {
  private readonly logger = new Logger(PlateauCatalogService.name)

  constructor(
    @Inject(FIRESTORE)
    private readonly firestore: Firestore,
    @Inject(PlateauCatalogDataset)
    private readonly datasetCollection: CollectionReference<PlateauCatalogDataset>
  ) {}

  async syncWithRemote(): Promise<void> {
    this.logger.log('Started syncing with remote...')
    const { data } = await axios<PlateauCatalog>(
      'https://api.plateau.reearth.io/datacatalog/plateau-2022',
      { responseType: 'json' }
    )
    const errors = validate(schema as Schema, data)
    if (errors.length > 0) {
      throw new Error(
        `Error during catalog validation: ${errors
          .map(error => JSON.stringify(error))
          .join('\n')}`
      )
    }

    this.logger.log('Uploading catalog...')
    const writer = this.firestore.bulkWriter()
    data.forEach(entry => {
      const ref = this.firestore.doc(`api/plateau/datasets/${entry.id}`)
      writer.set(ref, entry).catch(error => {
        throw error
      })
    })
    await writer.close()
    this.logger.log('Finished uploading catalog')
  }

  async findAll(): Promise<PlateauCatalogDataset[]> {
    const snapshot = await this.datasetCollection.get()
    return snapshot.docs.map(doc => doc.data())
  }
}
