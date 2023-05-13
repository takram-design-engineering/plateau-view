import {
  CollectionReference,
  Firestore,
  type BulkWriter
} from '@google-cloud/firestore'
import { Inject, Injectable, Logger } from '@nestjs/common'
import axios from 'axios'
import { validate, type Schema } from 'jtd'

import { FIRESTORE } from '@plateau/nest-firestore'
import { isNotNullish } from '@plateau/type-helpers'

import schema from '../assets/plateau-2022.jtd.json'
import { PlateauCatalog, type PlateauCatalogData } from './dto/PlateauCatalog'
import { type PlateauDataset } from './dto/PlateauDataset'
import { PlateauMunicipality } from './dto/PlateauMunicipality'
import { createDataset } from './helpers/createDataset'
import { getMunicipalitiesInCatalog } from './helpers/getMunicipalitiesInCatalog'

@Injectable()
export class PlateauCatalogService {
  private readonly logger = new Logger(PlateauCatalogService.name)

  constructor(
    @Inject(FIRESTORE)
    private readonly firestore: Firestore,
    @Inject(PlateauCatalog)
    private readonly catalogCollection: CollectionReference<PlateauCatalog>,
    @Inject(PlateauMunicipality)
    private readonly municipalityCollection: CollectionReference<PlateauMunicipality>
  ) {}

  async findAll(): Promise<PlateauDataset[]> {
    // TODO: Pagination
    const snapshot = await this.catalogCollection.get()
    return snapshot.docs
      .map(doc => createDataset(doc.data()))
      .filter(isNotNullish)
  }

  async findMany(params: {
    municipalityCode: string
  }): Promise<PlateauDataset[]> {
    // TODO: Use logical OR when @google-cloud/firestore supports it.
    const [citySnapshot, wardSnapshot] = await Promise.all([
      this.catalogCollection
        .where('data.city_code', '==', params.municipalityCode)
        .get(),
      this.catalogCollection
        .where('data.ward_code', '==', params.municipalityCode)
        .get()
    ])
    return [
      // Firestore currently doesn't support query for null value.
      ...citySnapshot.docs
        .map(doc => doc.data())
        .filter(
          data => !('ward_code' in data.data) || data.data.ward_code == null
        ),
      ...wardSnapshot.docs.map(doc => doc.data())
    ]
      .map(data => createDataset(data))
      .filter(isNotNullish)
  }

  async syncWithRemote(): Promise<void> {
    this.logger.log('Started syncing with remote...')
    const { data } = await axios<PlateauCatalogData[]>(
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

    // TODO: Clean up obsolete records.
    let writer: BulkWriter

    this.logger.log('Updating datasets...')
    writer = this.firestore.bulkWriter()
    data.forEach(data => {
      const ref = this.catalogCollection.doc(data.id)
      void writer.set(ref, { data })
    })
    await writer.close()
    this.logger.log('Finished updating datasets')

    // Store municipalities unique in the catalog.
    this.logger.log('Updating municipalities...')
    const municipalities = getMunicipalitiesInCatalog(data)
    writer = this.firestore.bulkWriter()
    for (const municipality of municipalities.values()) {
      const ref = this.municipalityCollection.doc(municipality.code)
      void writer.set(ref, municipality)
    }
    await writer.close()
    this.logger.log('Finished updating municipalities')
  }
}
