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
import { isNotNullish } from '@plateau/type-helpers'

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
    const [code, name] =
      entry.ward_code != null
        ? [entry.ward_code, entry.ward]
        : [entry.city_code, entry.city]
    if (code == null) {
      return
    }
    invariant(name != null, 'Missing name')

    const data: PlateauMunicipality = {
      type: 'municipality',
      code,
      name,
      parents: [
        entry.city_code !== code && entry.city_code != null
          ? ({
              type: 'municipality',
              code: entry.city_code
            } as const)
          : undefined,
        {
          type: 'prefecture',
          code: entry.pref_code
        } as const
      ].filter(isNotNullish)
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
      !isEqual(prevData.parents, data.parents) &&
      isEqual(omit(prevData, 'parents'), omit(data, 'parents'))
    ) {
      // Some entries inconsistently doesn't seem to have city codes. Take more
      // specific one for our parent code.
      if (data.parents.length > prevData.parents.length) {
        municipalities.set(prevData.code, {
          ...prevData,
          parents: data.parents
        })
      } else if (data.parents.length === prevData.parents.length) {
        municipalities.set(prevData.code, {
          ...prevData,
          parents: data.parents.map((parent, index) => {
            const prevParent = prevData.parents[index]
            invariant(parent.type === prevParent.type)
            return +parent.code > +prevParent.code ? parent : prevParent
          })
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
    private readonly datasetCollection: CollectionReference<PlateauDataset>,
    @Inject(PlateauMunicipality)
    private readonly municipalityCollection: CollectionReference<PlateauMunicipality>
  ) {}

  async findAll(): Promise<PlateauDataset[]> {
    const snapshot = await this.datasetCollection.get()
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
      const ref = this.datasetCollection.doc(entry.id)
      void writer.set(ref, entry)
    })
    await writer.close()
    this.logger.log('Finished updating datasets')

    // Store municipalities unique in the catalog.
    this.logger.log('Updating municipalities...')
    const municipalities = reduceMunicipalities(data)
    writer = this.firestore.bulkWriter()
    for (const municipality of municipalities.values()) {
      const ref = this.municipalityCollection.doc(municipality.code)
      void writer.set(ref, municipality)
    }
    await writer.close()
    this.logger.log('Finished updating municipalities')
  }
}
