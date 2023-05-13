// import { Injectable } from '@nestjs/common'
// import { Query, Resolver } from '@nestjs/graphql'

// import { PlateauMunicipalitiesService } from '../PlateauMunicipalitiesService'
// import { PlateauDataset } from '../dto/PlateauDataset'

// @Injectable()
// @Resolver()
// export class PlateauMunicipalitiesResolver {
//   constructor(private readonly service: PlateauMunicipalitiesService) {}

//   @Query(() => [PlateauDataset])
//   async datasets(): Promise<PlateauDataset[]> {
//     return await this.service.findAll()
//   }
// }
