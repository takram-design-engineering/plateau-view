import {
  ClassificationType,
  Color,
  CustomDataSource,
  type Entity
} from '@cesium/engine'
import { ColorMaterialProperty } from '@cesium/engine'
import axios from 'axios'
import { type Feature, type MultiPolygon, type Polygon } from 'geojson'
import invariant from 'tiny-invariant'
import { feature } from 'topojson-client'
import type TopoJSON from 'topojson-specification'
import { type SetRequired } from 'type-fest'

import { convertPolygonToHierarchyArray } from '@plateau/cesium-helpers'

export interface MunicipalityProperties {
  municipalityCode: string
  municipalityName: string
  prefectureCode: string
  prefectureName: string
}

export type MunicipalityEntity = SetRequired<Entity, 'polygon'>

type Topology = TopoJSON.Topology<{
  root: {
    type: 'GeometryCollection'
    geometries: Array<TopoJSON.GeometryObject<MunicipalityProperties>>
  }
}>

type MunicipalityFeature = Feature<
  Polygon | MultiPolygon,
  MunicipalityProperties
>

function isPolygonFeature<T extends Feature>(
  feature: T
): feature is T & { geometry: { type: 'Polygon' | 'MultiPolygon' } } {
  return (
    feature.geometry.type === 'Polygon' ||
    feature.geometry.type === 'MultiPolygon'
  )
}

export interface MunicipalityDataSourceOptions {
  color?: Color
}

export class MunicipalityDataSource extends CustomDataSource {
  private readonly color: Color
  private readonly entitiesRecord: Record<
    string, // Municipality code
    MunicipalityEntity[] | undefined
  > = {}

  private constructor({
    color = new Color(0, 0, 0, 0.1)
  }: MunicipalityDataSourceOptions = {}) {
    super()
    this.color = color
  }

  static async fromUrl(
    url: string,
    options: MunicipalityDataSourceOptions = {}
  ): Promise<MunicipalityDataSource> {
    const response = await axios<Topology>(url, {
      responseType: 'json'
    })
    const topology = response.data
    const root = response.data.objects.root
    const features = feature(topology, root).features
    const dataSource = new MunicipalityDataSource(options)
    for (const feature of features) {
      invariant(isPolygonFeature(feature))
      dataSource.addEntity(feature)
    }
    return dataSource
  }

  findEntities(
    municipalityCode: string
  ): readonly MunicipalityEntity[] | undefined {
    return this.entitiesRecord[municipalityCode]
  }

  private addEntity(
    feature: MunicipalityFeature
  ): readonly MunicipalityEntity[] {
    const { properties, geometry } = feature
    const hierarchies = convertPolygonToHierarchyArray(geometry)
    const material = new ColorMaterialProperty(this.color)
    const entities = hierarchies.map(
      (hierarchy, index) =>
        this.entities.add({
          id: `${properties.municipalityCode}-${index}`,
          properties,
          polygon: {
            hierarchy,
            material,
            classificationType: ClassificationType.TERRAIN
          }
        }) as MunicipalityEntity
    )

    this.entitiesRecord[feature.properties.municipalityCode] = entities
    return entities
  }
}
