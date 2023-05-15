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

export interface AreaProperties {
  prefectureCode: string
  prefectureName: string
  municipalityCode?: string
  municipalityName?: string
}

export type AreaEntity = SetRequired<Entity, 'polygon'>

type Topology = TopoJSON.Topology<{
  root: {
    type: 'GeometryCollection'
    geometries: Array<
      TopoJSON.Polygon<AreaProperties> | TopoJSON.MultiPolygon<AreaProperties>
    >
  }
}>

type AreaFeature = Feature<Polygon | MultiPolygon, AreaProperties>

function isPolygonFeature<T extends Feature>(
  feature: T
): feature is T & { geometry: { type: 'Polygon' | 'MultiPolygon' } } {
  return (
    feature.geometry.type === 'Polygon' ||
    feature.geometry.type === 'MultiPolygon'
  )
}

export interface AreaDataSourceOptions {
  color?: Color
}

export class AreaDataSource extends CustomDataSource {
  private readonly color: Color
  private readonly entitiesRecord: Record<string, AreaEntity[] | undefined> = {}

  private constructor({
    color = new Color(0, 0, 0, 0.1)
  }: AreaDataSourceOptions = {}) {
    super()
    this.color = color
  }

  static async fromUrl(
    url: string,
    options: AreaDataSourceOptions = {}
  ): Promise<AreaDataSource> {
    const response = await axios<Topology>(url, {
      responseType: 'json'
    })
    const topology = response.data
    const root = response.data.objects.root
    const features = feature(topology, root).features
    const dataSource = new AreaDataSource(options)
    for (const feature of features) {
      invariant(isPolygonFeature(feature))
      dataSource.addEntity(feature)
    }
    return dataSource
  }

  findEntities(code: string): readonly AreaEntity[] | undefined {
    return this.entitiesRecord[code]
  }

  private addEntity(feature: AreaFeature): readonly AreaEntity[] {
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
        }) as AreaEntity
    )

    this.entitiesRecord[
      feature.properties.municipalityCode ?? feature.properties.prefectureCode
    ] = entities
    return entities
  }
}
