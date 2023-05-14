import { Field, ObjectType } from '@nestjs/graphql'

import { PlateauDataset, PlateauDatasetVariant } from '../PlateauDataset'

@ObjectType({
  implements: [PlateauDatasetVariant]
})
class PlateauDefaultDatasetVariant extends PlateauDatasetVariant {}

@ObjectType({
  implements: [PlateauDataset]
})
export class PlateauDefaultDataset extends PlateauDataset {
  @Field(() => [PlateauDefaultDatasetVariant])
  get variants(): PlateauDefaultDatasetVariant[] {
    return 'config' in this.catalog.data
      ? this.catalog.data.config?.data.map(data => ({
          type: data.type,
          url: data.url,
          name: data.name
        })) ?? []
      : []
  }
}
