import {
  CollectionReference,
  type DocumentSnapshot,
  type Query
} from '@google-cloud/firestore'
import { Inject, Injectable } from '@nestjs/common'
import { uniq } from 'lodash'

import { isNotNullish } from '@takram/plateau-type-helpers'

import { PlateauCatalog } from './dto/PlateauCatalog'
import { type PlateauDatasetType } from './dto/PlateauDatasetType'
import { PlateauMunicipality } from './dto/PlateauMunicipality'

@Injectable()
export class PlateauMunicipalityService {
  constructor(
    @Inject(PlateauMunicipality)
    private readonly municipalityCollection: CollectionReference<PlateauMunicipality>,
    @Inject(PlateauCatalog)
    private readonly catalogCollection: CollectionReference<PlateauCatalog>
  ) {}

  async findAll(
    params: {
      prefectureCode?: string
      datasetType?: PlateauDatasetType
    } = {}
  ): Promise<PlateauMunicipality[]> {
    if (params.datasetType == null) {
      let query: Query<PlateauMunicipality> = this.municipalityCollection
      if (params.prefectureCode != null) {
        query = query
          .where('code', '>=', params.prefectureCode)
          .where('code', '<=', `${params.prefectureCode}\uf8ff`)
      }
      const snapshot = await query.get()
      const municipalities = snapshot.docs.map(doc => doc.data())
      if (params.datasetType == null) {
        return municipalities
      }
    }

    let query: CollectionReference | Query =
      this.catalogCollection.withConverter(null)
    if (params.prefectureCode != null) {
      query = query.where('data.pref_code', '==', params.prefectureCode)
    }
    const snapshot = await query
      .where('data.type', '==', params.datasetType)
      .select('data.city_code', 'data.ward_code')
      .get()
    const municipalityCodes = uniq(
      snapshot.docs
        .map(doc => {
          const data = (doc.data() as Pick<PlateauCatalog, 'data'>).data
          if (data == null) {
            return undefined
          }
          return 'ward_code' in data
            ? data.ward_code ?? data.city_code
            : data.city_code
        })
        .filter(isNotNullish)
    ).sort()

    const snapshots = (await this.municipalityCollection.firestore.getAll(
      ...municipalityCodes.map(code => this.municipalityCollection.doc(code))
    )) as Array<DocumentSnapshot<PlateauMunicipality>>
    return snapshots.map(snapshot => snapshot.data()).filter(isNotNullish)
  }

  async findOne(
    params: Pick<PlateauMunicipality, 'code'>
  ): Promise<PlateauMunicipality | undefined> {
    const doc = await this.municipalityCollection.doc(params.code).get()
    return doc.data()
  }
}
