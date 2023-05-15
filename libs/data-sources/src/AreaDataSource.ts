import {
  BoundingSphere,
  Cartesian3,
  ClassificationType,
  Color,
  ColorMaterialProperty,
  CustomDataSource,
  Entity
} from '@cesium/engine'
import axios from 'axios'
import { type Feature, type MultiPolygon, type Polygon } from 'geojson'
import invariant from 'tiny-invariant'
import { feature } from 'topojson-client'
import type TopoJSON from 'topojson-specification'
import { type SetRequired } from 'type-fest'

import { convertPolygonToHierarchyArray } from '@plateau/cesium-helpers'
import { JapanSeaLevelEllipsoid } from '@plateau/datasets'

export interface AreaProperties {
  prefectureCode: string
  prefectureName: string
  municipalityCode?: string
  municipalityName?: string
  poleOfInaccessibility: [number, number]
  center: [number, number]
  radius: number
}

export type AreaFeature = Feature<Polygon | MultiPolygon, AreaProperties>
export type AreaEntity = SetRequired<Entity, 'polygon'> & {
  boundingSphere: BoundingSphere
}

type Topology = TopoJSON.Topology<{
  root: {
    type: 'GeometryCollection'
    geometries: Array<
      TopoJSON.Polygon<AreaProperties> | TopoJSON.MultiPolygon<AreaProperties>
    >
  }
}>

function isPolygonFeature<T extends Feature>(
  feature: T
): feature is T & { geometry: { type: 'Polygon' | 'MultiPolygon' } } {
  return (
    feature.geometry.type === 'Polygon' ||
    feature.geometry.type === 'MultiPolygon'
  )
}

function isPolygonFeatures<T extends Feature>(
  features: T[]
): features is Array<T & { geometry: { type: 'Polygon' | 'MultiPolygon' } }> {
  return features.every(feature => isPolygonFeature(feature))
}

export interface AreaDataSourceOptions {
  color?: Color
}

export class AreaDataSource extends CustomDataSource {
  private readonly color: Color
  private readonly entitiesCache: Record<string, AreaEntity[] | undefined> = {}

  private constructor(
    private readonly features: AreaFeature[],
    { color = new Color(0, 0, 0, 0.1) }: AreaDataSourceOptions = {}
  ) {
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
    invariant(isPolygonFeatures(features))
    return new AreaDataSource(features, options)
  }

  getFeature(code: string): AreaFeature | undefined {
    return this.features.find(
      feature =>
        feature.properties.municipalityCode === code ||
        (feature.properties.municipalityCode == null &&
          feature.properties.prefectureCode === code)
    )
  }

  getEntities(code: string): readonly AreaEntity[] | undefined {
    const feature = this.getFeature(code)
    if (feature == null) {
      return
    }
    return (
      this.entitiesCache[code] ??
      (this.entitiesCache[code] = this.createEntities(feature))
    )
  }

  private createEntities(feature: AreaFeature): AreaEntity[] {
    const { properties, geometry } = feature
    const hierarchies = convertPolygonToHierarchyArray(geometry)
    const material = new ColorMaterialProperty(this.color)
    const boundingSphere = new BoundingSphere()
    Cartesian3.fromDegrees(
      ...properties.poleOfInaccessibility,
      0,
      JapanSeaLevelEllipsoid,
      boundingSphere.center
    )
    boundingSphere.radius = properties.radius

    const code = properties.municipalityCode ?? properties.prefectureCode
    return hierarchies.map((hierarchy, index) => {
      const entity = new Entity({
        id: `AreaEntity:Polygon:${code}-${index}`,
        properties,
        polygon: {
          hierarchy,
          material,
          classificationType: ClassificationType.TERRAIN
        }
      }) as AreaEntity
      entity.boundingSphere = boundingSphere
      return entity
    })
  }
}
