import { registerEnumType } from '@nestjs/graphql'

export enum PlateauAreaTypeEnum {
  Prefecture = 'prefecture',
  Municipality = 'municipality'
}

export type PlateauAreaType = `${PlateauAreaTypeEnum}`

registerEnumType(PlateauAreaTypeEnum, {
  name: 'PlateauAreaType'
})
