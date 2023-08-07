import { CollectionReference } from '@google-cloud/firestore'
import { Inject, Injectable } from '@nestjs/common'
import { uniq } from 'lodash'

import { isNotNullish } from '@takram/plateau-type-helpers'

import { PlateauCatalog } from './dto/PlateauCatalog'
import { type PlateauDatasetType } from './dto/PlateauDatasetType'
import { PlateauMunicipality } from './dto/PlateauMunicipality'
import { PlateauPrefecture } from './dto/PlateauPrefecture'

@Injectable()
export class PlateauPrefectureService {
  constructor(
    @Inject(PlateauMunicipality)
    private readonly municipalityCollection: CollectionReference<PlateauMunicipality>,
    @Inject(PlateauCatalog)
    private readonly catalogCollection: CollectionReference<PlateauCatalog>
  ) {}

  async findAll(
    params: {
      datasetType?: PlateauDatasetType
    } = {}
  ): Promise<PlateauPrefecture[]> {
    if (params.datasetType == null) {
      const snapshot = await this.municipalityCollection
        .withConverter(null)
        .select('code')
        .get()
      const prefectureCodes = uniq(
        snapshot.docs.map(doc =>
          (doc.data() as Pick<PlateauMunicipality, 'code'>).code.slice(0, 2)
        )
      ).sort()
      return prefectureCodes.map(code => PlateauPrefecture.values[code])
    }

    const snapshot = await this.catalogCollection
      .withConverter(null)
      .where('data.type', '==', params.datasetType)
      .select('data.pref_code')
      .get()
    const prefectureCodes = uniq(
      snapshot.docs
        .map(doc => (doc.data() as Pick<PlateauCatalog, 'data'>).data.pref_code)
        .filter(isNotNullish)
    ).sort()
    return prefectureCodes.map(code => PlateauPrefecture.values[code])
  }

  findOne(
    params: Pick<PlateauPrefecture, 'code'>
  ): PlateauPrefecture | undefined {
    return PlateauPrefecture.values[params.code]
  }
}
