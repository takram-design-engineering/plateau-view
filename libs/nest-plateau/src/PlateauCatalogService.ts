import {
  CollectionReference,
  Firestore,
  type BulkWriter,
  type Query
} from '@google-cloud/firestore'
import { Inject, Injectable, Logger } from '@nestjs/common'
import axios from 'axios'
import { validate, type Schema } from 'jtd'
import { type Constructor } from 'type-fest'

import { FIRESTORE } from '@plateau/nest-firestore'
import { isNotNullish } from '@plateau/type-helpers'

import { PlateauStorageService } from './PlateauStorageService'
import schema from './assets/plateau-2022.jtd.json'
import { PlateauBuildingDataset } from './dto/PlateauBuildingDataset'
import { PlateauCatalog, type PlateauCatalogData } from './dto/PlateauCatalog'
import { type PlateauDataset } from './dto/PlateauDataset'
import {
  PlateauDatasetTypeEnum,
  type PlateauDatasetType
} from './dto/PlateauDatasetType'
import { PlateauDefaultDataset } from './dto/PlateauDefaultDataset'
import { PlateauMunicipality } from './dto/PlateauMunicipality'
import { getMunicipalitiesInCatalog } from './helpers/getMunicipalitiesInCatalog'

const datasetConstructors: Record<
  string,
  Constructor<PlateauDataset> | undefined
> = {
  [PlateauDatasetTypeEnum.Border]: PlateauDefaultDataset,
  [PlateauDatasetTypeEnum.Bridge]: PlateauDefaultDataset,
  [PlateauDatasetTypeEnum.Building]: PlateauBuildingDataset,
  [PlateauDatasetTypeEnum.EmergencyRoute]: PlateauDefaultDataset,
  [PlateauDatasetTypeEnum.Facility]: PlateauDefaultDataset,
  [PlateauDatasetTypeEnum.Flood]: PlateauDefaultDataset,
  [PlateauDatasetTypeEnum.Furniture]: PlateauDefaultDataset,
  [PlateauDatasetTypeEnum.Generic]: PlateauDefaultDataset,
  [PlateauDatasetTypeEnum.Hightide]: PlateauDefaultDataset,
  [PlateauDatasetTypeEnum.InlandFlood]: PlateauDefaultDataset,
  [PlateauDatasetTypeEnum.Landmark]: PlateauDefaultDataset,
  [PlateauDatasetTypeEnum.Landslide]: PlateauDefaultDataset,
  [PlateauDatasetTypeEnum.Landuse]: PlateauDefaultDataset,
  [PlateauDatasetTypeEnum.Park]: PlateauDefaultDataset,
  [PlateauDatasetTypeEnum.Railway]: PlateauDefaultDataset,
  [PlateauDatasetTypeEnum.Road]: PlateauDefaultDataset,
  [PlateauDatasetTypeEnum.Shelter]: PlateauDefaultDataset,
  [PlateauDatasetTypeEnum.Station]: PlateauDefaultDataset,
  [PlateauDatasetTypeEnum.Tsunami]: PlateauDefaultDataset,
  [PlateauDatasetTypeEnum.UseCase]: PlateauDefaultDataset,
  [PlateauDatasetTypeEnum.Vegetation]: PlateauDefaultDataset
}

@Injectable()
export class PlateauCatalogService {
  private readonly logger = new Logger(PlateauCatalogService.name)

  constructor(
    @Inject(FIRESTORE)
    private readonly firestore: Firestore,
    @Inject(PlateauCatalog)
    private readonly catalogCollection: CollectionReference<PlateauCatalog>,
    @Inject(PlateauMunicipality)
    private readonly municipalityCollection: CollectionReference<PlateauMunicipality>,
    private readonly storageService: PlateauStorageService
  ) {}

  private createDataset(catalog: PlateauCatalog): PlateauDataset | undefined {
    const constructor = datasetConstructors[catalog.data.type]
    if (constructor == null) {
      return
    }
    const dataset = new constructor(catalog, this.storageService)
    if (dataset.variants.length === 0) {
      return // Useless dataset
    }
    return dataset
  }

  // TODO: Pagination
  async findAll(
    params: {
      municipalityCode?: string
      excludeTypes?: readonly PlateauDatasetType[]
    } = {}
  ): Promise<PlateauDataset[]> {
    if (params.municipalityCode == null) {
      let query: Query<PlateauCatalog> = this.catalogCollection
      if (params.excludeTypes != null) {
        query = query.where('data.type', 'not-in', params.excludeTypes)
      }
      const snapshot = await query.get()
      return snapshot.docs
        .map(doc => this.createDataset(doc.data()))
        .filter(isNotNullish)
    }

    // TODO: Use logical OR when @google-cloud/firestore supports it.
    let cityQuery: Query<PlateauCatalog> = this.catalogCollection.where(
      'data.city_code',
      '==',
      params.municipalityCode
    )
    let wardQuery: Query<PlateauCatalog> = this.catalogCollection.where(
      'data.ward_code',
      '==',
      params.municipalityCode
    )
    if (params.excludeTypes != null) {
      cityQuery = cityQuery.where('data.type', 'not-in', params.excludeTypes)
      wardQuery = wardQuery.where('data.type', 'not-in', params.excludeTypes)
    }
    const [citySnapshot, wardSnapshot] = await Promise.all([
      cityQuery.get(),
      wardQuery.get()
    ])
    return [
      // Firestore currently doesn't have query to match null values.
      ...citySnapshot.docs
        .map(doc => doc.data())
        .filter(
          data => !('ward_code' in data.data) || data.data.ward_code == null
        ),
      ...wardSnapshot.docs.map(doc => doc.data())
    ]
      .map(data => this.createDataset(data))
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
