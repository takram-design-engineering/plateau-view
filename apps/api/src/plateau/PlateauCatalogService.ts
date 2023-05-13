import {
  CollectionReference,
  Firestore,
  type BulkWriter
} from '@google-cloud/firestore'
import { Inject, Injectable, Logger } from '@nestjs/common'
import axios from 'axios'
import { validate, type Schema } from 'jtd'
import { isEqual, omit } from 'lodash'
import invariant from 'tiny-invariant'

import { FIRESTORE } from '@plateau/nest-firestore'

import schema from '../assets/plateau-2022.jtd.json'
import { PlateauDataset } from './dto/PlateauDataset'
import { PlateauMunicipality } from './dto/PlateauMunicipality'
import { type PlateauCatalog } from './schemas/catalog'

function reduceMunicipalities(data: PlateauCatalog): PlateauMunicipality[] {
  const municipalities = new Map<string, PlateauMunicipality>()
  data.forEach(entry => {
    if (entry.pref_code == null) {
      return
    }
    const [code, name, parentCode] =
      entry.ward_code != null
        ? [entry.ward_code, entry.ward, entry.city_code ?? entry.pref_code]
        : [entry.city_code, entry.city, entry.pref_code]
    if (code == null) {
      return
    }
    invariant(name != null, 'Missing name')
    invariant(parentCode != null, 'Missing parentCode')

    const data: PlateauMunicipality = {
      code,
      name,
      parentCode,
      prefectureCode: entry.pref_code
    }
    if (!municipalities.has(data.code)) {
      municipalities.set(data.code, data)
      return
    }

    // Validate if every data is the same.
    const prevData = municipalities.get(data.code)
    invariant(prevData != null)
    if (isEqual(prevData, data)) {
      return
    }
    if (
      prevData.parentCode !== data.parentCode &&
      isEqual(omit(prevData, 'parentCode'), omit(data, 'parentCode'))
    ) {
      // Some entries inconsistently doesn't seem to have city codes. Take more
      // specific one for our parent code.
      if (
        data.parentCode.length > prevData.parentCode.length ||
        +data.parentCode > +prevData.parentCode
      ) {
        municipalities.set(prevData.code, {
          ...prevData,
          parentCode: data.parentCode
        })
      }
    } else {
      throw new Error(
        `Inconsistent municipality data: expected=${JSON.stringify(
          prevData
        )} actual=${JSON.stringify(data)}`
      )
    }
  })
  return Array.from(municipalities.values())
}

@Injectable()
export class PlateauCatalogService {
  private readonly logger = new Logger(PlateauCatalogService.name)

  constructor(
    @Inject(FIRESTORE)
    private readonly firestore: Firestore,
    @Inject(PlateauDataset)
    private readonly datasets: CollectionReference<PlateauDataset>,
    @Inject(PlateauMunicipality)
    private readonly municipalities: CollectionReference<PlateauMunicipality>
  ) {}

  async findAll(): Promise<PlateauDataset[]> {
    const snapshot = await this.datasets.get()
    return snapshot.docs.map(doc => doc.data())
  }

  // async findAllMunicipalityCodes(): Promise<string[]> {
  //   const snapshot = await this.datasets.select('city_code').get()
  // }

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

    // TODO: Clean up obsolete records.
    let writer: BulkWriter

    this.logger.log('Updating datasets...')
    writer = this.firestore.bulkWriter()
    data.forEach(entry => {
      const ref = this.datasets.doc(entry.id)
      void writer.set(ref, entry)
    })
    await writer.close()
    this.logger.log('Finished updating datasets')

    // Store municipalities unique in the catalog.
    this.logger.log('Updating municipalities...')
    const municipalities = reduceMunicipalities(data)
    writer = this.firestore.bulkWriter()
    for (const municipality of municipalities.values()) {
      const ref = this.municipalities.doc(municipality.code)
      void writer.set(ref, municipality)
    }
    await writer.close()
    this.logger.log('Finished updating municipalities')
  }
}
