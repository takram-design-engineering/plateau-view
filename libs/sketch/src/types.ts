import { type Feature, type MultiPolygon, type Polygon } from 'geojson'
import { type SetRequired } from 'type-fest'

export type SketchGeometryType = 'circle' | 'rectangle' | 'polygon'

export interface SketchFeatureProperties {
  type?: SketchGeometryType
  positions?: Array<[number, number, number]>
  extrudedHeight?: number
}

export type SketchFeature = Feature<
  Polygon | MultiPolygon,
  SketchFeatureProperties
>

export type GeometryFeature = SetRequired<Feature<Polygon | MultiPolygon>, 'id'>
