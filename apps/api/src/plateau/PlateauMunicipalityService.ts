import { CollectionReference } from '@google-cloud/firestore'
import { Inject, Injectable } from '@nestjs/common'

import { PlateauMunicipality } from './dto/PlateauMunicipality'

@Injectable()
export class PlateauMunicipalityService {
  constructor(
    @Inject(PlateauMunicipality)
    private readonly collection: CollectionReference<PlateauMunicipality>
  ) {}

  async findAll(): Promise<PlateauMunicipality[]> {
    const snapshot = await this.collection.get()
    return snapshot.docs.map(doc => doc.data())
  }

  async findOne(
    params: Pick<PlateauMunicipality, 'code'>
  ): Promise<PlateauMunicipality | undefined> {
    const doc = await this.collection.doc(params.code).get()
    return doc.data()
  }
}
