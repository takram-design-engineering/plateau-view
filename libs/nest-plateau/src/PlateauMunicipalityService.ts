import { CollectionReference, type Query } from '@google-cloud/firestore'
import { BadRequestException, Inject, Injectable } from '@nestjs/common'

import { PlateauMunicipality } from './dto/PlateauMunicipality'

@Injectable()
export class PlateauMunicipalityService {
  constructor(
    @Inject(PlateauMunicipality)
    private readonly collection: CollectionReference<PlateauMunicipality>
  ) {}

  async findAll(
    params: {
      prefectureCode?: string
    } = {}
  ): Promise<PlateauMunicipality[]> {
    let query: Query<PlateauMunicipality> = this.collection
    if (params.prefectureCode != null) {
      if (!/^\d{2}$/.test(params.prefectureCode)) {
        throw new BadRequestException('Illegal prefecture code')
      }
      query = query
        .where('code', '>=', params.prefectureCode)
        .where('code', '<=', `${params.prefectureCode}\uf8ff`)
    }
    const snapshot = await query.get()
    return snapshot.docs.map(doc => doc.data())
  }

  async findOne(
    params: Pick<PlateauMunicipality, 'code'>
  ): Promise<PlateauMunicipality | undefined> {
    const doc = await this.collection.doc(params.code).get()
    return doc.data()
  }
}
