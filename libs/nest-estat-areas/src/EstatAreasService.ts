import {
  CollectionReference,
  type Query,
  type QuerySnapshot
} from '@google-cloud/firestore'
import { Inject, Injectable } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { uniqBy } from 'lodash'
import invariant from 'tiny-invariant'

import { isNotNullish } from '@takram/plateau-type-helpers'

import { EstatArea } from './dto/EstatArea'
import { EstatAreaDocument } from './dto/EstatAreaDocument'
import { EstatAreaGeometry } from './dto/EstatAreaGeometry'
import { unpackGeometry } from './helpers/packGeometry'

function createAreas(
  snapshot: QuerySnapshot<Pick<EstatAreaDocument, 'properties'>>,
  searchTokens?: readonly string[]
): EstatArea[] {
  const result = snapshot.docs.map(doc => {
    const data = doc.data()
    const props = data.properties
    const addressComponents = [
      props.PREF_NAME,
      props.GST_NAME,
      props.CSS_NAME,
      props.S_NAME
    ].filter(isNotNullish)
    return plainToInstance(EstatArea, {
      id: doc.id,
      prefectureCode: props.PREF,
      municipalityCode: `${props.PREF}${props.CITY}`,
      name: props.S_NAME,
      address: addressComponents.join(''),
      addressComponents
    } satisfies EstatArea)
  })
  if (searchTokens == null || searchTokens.length === 0) {
    return result
  }
  return result.filter(result =>
    searchTokens.every(token => result.addressComponents.includes(token))
  )
}

const searchFields = ['shortAddress', 'middleAddress', 'fullAddress']
const compoundSearchFields = [
  [
    'properties.S_NAME',
    'properties.CSS_NAME',
    'properties.GST_NAME',
    'properties.PREF_NAME'
  ],
  ['properties.S_NAME', 'properties.CSS_NAME', 'properties.GST_NAME'],
  ['properties.S_NAME', 'properties.CSS_NAME', 'properties.PREF_NAME'],
  ['properties.S_NAME', 'properties.GST_NAME', 'properties.PREF_NAME'],
  ['properties.S_NAME', 'properties.CSS_NAME'],
  ['properties.S_NAME', 'properties.GST_NAME'],
  ['properties.S_NAME', 'properties.PREF_NAME'],
  ['properties.CSS_NAME', 'properties.GST_NAME', 'properties.PREF_NAME'],
  ['properties.CSS_NAME', 'properties.PREF_NAME'],
  ['properties.GST_NAME', 'properties.PREF_NAME'],
  ['properties.S_NAME'],
  ['properties.CSS_NAME'],
  ['properties.GST_NAME'],
  ['properties.PREF_NAME']
]

@Injectable()
export class EstatAreasService {
  constructor(
    @Inject(EstatAreaDocument)
    private readonly areaCollection: CollectionReference<EstatAreaDocument>
  ) {}

  async findAll(params: {
    searchTokens: readonly string[]
    limit?: number
  }): Promise<EstatArea[]> {
    const { limit = 10 } = params

    for (const field of searchFields) {
      const snapshot = (await this.areaCollection
        .where(field, 'in', params.searchTokens)
        .orderBy('properties.SETAI', 'desc')
        .limit(limit)
        .select('properties')
        .get()) as QuerySnapshot<Pick<EstatAreaDocument, 'properties'>>
      if (snapshot.size > 0) {
        return createAreas(snapshot).slice(0, limit)
      }
    }

    let result: EstatArea[] = []
    for (const fields of compoundSearchFields) {
      const query = fields.reduce<Query>(
        (query, field) => query.where(field, 'in', params.searchTokens),
        this.areaCollection
      )
      const snapshot = (await query
        .orderBy('properties.SETAI', 'desc')
        .limit(limit * 2) // Double this because some will be filtered out.
        .select('properties')
        .get()) as QuerySnapshot<Pick<EstatAreaDocument, 'properties'>>
      result = uniqBy(
        [...result, ...createAreas(snapshot, params.searchTokens)],
        'id'
      )
      if (result.length >= limit) {
        return result.slice(0, limit)
      }
    }

    return result
  }

  async findGeometry(params: {
    areaId: string
  }): Promise<EstatAreaGeometry | undefined> {
    const doc = await this.areaCollection.doc(params.areaId).get()
    if (!doc.exists) {
      return
    }
    const data = doc.data()
    invariant(data != null)
    return plainToInstance(EstatAreaGeometry, {
      id: doc.id,
      // @ts-expect-error Coerce to JSON type
      geometry: unpackGeometry(data.geometry),
      bbox: data.bbox
    } satisfies EstatAreaGeometry)
  }
}
