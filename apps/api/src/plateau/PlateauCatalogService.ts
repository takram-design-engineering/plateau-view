import {
  CollectionReference,
  Firestore,
  type BulkWriter
} from '@google-cloud/firestore'
import { Inject, Injectable, Logger } from '@nestjs/common'
import axios from 'axios'
import { validate, type Schema } from 'jtd'
import { uniqBy } from 'lodash'

import { FIRESTORE } from '@plateau/nest-firestore'

import schema from '../assets/plateau-2022.jtd.json'
import { PlateauBuildingDataset } from './dto/PlateauBuildingDataset'
import { PlateauCatalog } from './dto/PlateauCatalog'
import { type PlateauDataset } from './dto/PlateauDataset'
import { PlateauMunicipality } from './dto/PlateauMunicipality'
import { PlateauUnknownDataset } from './dto/PlateauUnknownDataset'
import { getMunicipalitiesInCatalog } from './helpers/getMunicipalitiesInCatalog'
import { type PlateauCatalog0 } from './schemas/catalog'

function createDataset(catalog: PlateauCatalog0): PlateauDataset {
  switch (catalog.type) {
    case 'フォルダ':
      return new PlateauUnknownDataset(catalog)
    case 'ユースケース':
      return new PlateauUnknownDataset(catalog)
    case 'ランドマーク情報':
      return new PlateauUnknownDataset(catalog)
    case '公園情報':
      return new PlateauUnknownDataset(catalog)
    case '内水浸水想定区域モデル':
      return new PlateauUnknownDataset(catalog)
    case '土地利用モデル':
      return new PlateauUnknownDataset(catalog)
    case '土砂災害警戒区域モデル':
      return new PlateauUnknownDataset(catalog)
    case '建築物モデル':
      return new PlateauBuildingDataset(catalog)
    case '植生モデル':
      return new PlateauUnknownDataset(catalog)
    case '橋梁モデル':
      return new PlateauUnknownDataset(catalog)
    case '汎用都市オブジェクトモデル':
      return new PlateauUnknownDataset(catalog)
    case '津波浸水想定区域モデル':
      return new PlateauUnknownDataset(catalog)
    case '洪水浸水想定区域モデル':
      return new PlateauUnknownDataset(catalog)
    case '緊急輸送道路情報':
      return new PlateauUnknownDataset(catalog)
    case '行政界情報':
      return new PlateauUnknownDataset(catalog)
    case '道路モデル':
      return new PlateauUnknownDataset(catalog)
    case '避難施設情報':
      return new PlateauUnknownDataset(catalog)
    case '都市計画決定情報モデル':
      return new PlateauUnknownDataset(catalog)
    case '都市設備モデル':
      return new PlateauUnknownDataset(catalog)
    case '鉄道モデル':
      return new PlateauUnknownDataset(catalog)
    case '鉄道情報':
      return new PlateauUnknownDataset(catalog)
    case '鉄道駅情報':
      return new PlateauUnknownDataset(catalog)
    case '高潮浸水想定区域モデル':
      return new PlateauUnknownDataset(catalog)
    default:
      return new PlateauUnknownDataset(catalog)
  }
}

@Injectable()
export class PlateauCatalogService {
  private readonly logger = new Logger(PlateauCatalogService.name)

  constructor(
    @Inject(FIRESTORE)
    private readonly firestore: Firestore,
    @Inject(PlateauCatalog)
    private readonly catalogCollection: CollectionReference<PlateauCatalog0>,
    @Inject(PlateauMunicipality)
    private readonly municipalityCollection: CollectionReference<PlateauMunicipality>
  ) {}

  async findAll(): Promise<PlateauDataset[]> {
    // TODO: Pagination
    const snapshot = await this.catalogCollection.get()
    return snapshot.docs.map(doc => createDataset(doc.data()))
  }

  async findMany(params: {
    municipalityCode: string
  }): Promise<PlateauDataset[]> {
    // TODO: Use logical OR when @google-cloud/firestore supports it.
    const [citySnapshot, wardSnapshot] = await Promise.all([
      this.catalogCollection
        .where('city_code', '==', params.municipalityCode)
        .get(),
      this.catalogCollection
        .where('ward_code', '==', params.municipalityCode)
        .get()
    ])
    return uniqBy(
      [
        // Firestore currently doesn't support query for null value.
        ...citySnapshot.docs
          .map(doc => doc.data())
          .filter(data => !('ward_code' in data) || data.ward_code == null),
        ...wardSnapshot.docs.map(doc => doc.data())
      ],
      'id'
    ).map(data => createDataset(data))
  }

  async syncWithRemote(): Promise<void> {
    this.logger.log('Started syncing with remote...')
    const { data } = await axios<PlateauCatalog0[]>(
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
    data.forEach(entry => {
      const ref = this.catalogCollection.doc(entry.id)
      void writer.set(ref, entry)
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
