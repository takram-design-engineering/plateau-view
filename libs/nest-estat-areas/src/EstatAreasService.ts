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

const areaFields = [
  'PREF_NAME',
  'GST_NAME',
  'CSS_NAME',
  'S_NAME',
  'PREF',
  'CITY'
] as const
const selectAreaFields = areaFields.map(field => `properties.${field}`)

type AreaFields = (typeof areaFields)[number]

type AreaQuerySnapshot = QuerySnapshot<{
  properties: Pick<EstatAreaDocument['properties'], AreaFields>
}>

function createAreas(
  snapshot: AreaQuerySnapshot,
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
    const { limit = 100 } = params

    let result: EstatArea[] = []
    for (const fields of compoundSearchFields) {
      let disjunctionCount = 1
      let query: Query | typeof this.areaCollection = this.areaCollection
      for (const field of fields) {
        disjunctionCount *= params.searchTokens.length
        if (disjunctionCount > 30) {
          break
        }
        query = query.where(field, 'in', params.searchTokens)
      }
      const snapshot = (await query
        .orderBy('properties.SETAI', 'desc')
        .limit(limit * 2) // Double this because some will be filtered out.
        .select(...selectAreaFields)
        .get()) as AreaQuerySnapshot
      result = uniqBy(
        [...result, ...createAreas(snapshot, params.searchTokens)],
        'id'
      )
      if (result.length >= limit) {
        return result.slice(0, limit)
      }
    }
    if (result.length > 0) {
      return result
    }

    const [searchToken] = [...params.searchTokens].sort(
      (a, b) => b.length - a.length
    )
    for (const field of searchFields) {
      const snapshot = (await this.areaCollection
        .where(field, '>=', searchToken)
        .where(field, '<=', `${searchToken}\uf8ff`)
        .limit(limit)
        .select(...selectAreaFields)
        .get()) as AreaQuerySnapshot
      if (!snapshot.empty) {
        return createAreas(snapshot)
      }
    }
    return []
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
