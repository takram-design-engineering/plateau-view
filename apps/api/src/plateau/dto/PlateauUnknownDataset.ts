import { ObjectType } from '@nestjs/graphql'

import { PlateauDataset } from './PlateauDataset'

@ObjectType({
  implements: [PlateauDataset]
})
export class PlateauUnknownDataset extends PlateauDataset {}
