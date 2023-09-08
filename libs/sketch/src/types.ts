import { type Feature, type MultiPolygon, type Polygon } from 'geojson'
import { type SetRequired } from 'type-fest'

export const SKETCH_OBJECT = 'SKETCH_OBJECT'

declare module '@takram/plateau-screen-space-selection' {
  interface ScreenSpaceSelectionOverrides {
    [SKETCH_OBJECT]: string
  }
}

export type SketchGeometryType = 'circle' | 'rectangle' | 'polygon'

export function isSketchGeometryType(
  value: unknown
): value is SketchGeometryType {
  return value === 'circle' || value === 'rectangle' || value === 'polygon'
}

export interface SketchFeatureProperties {
  id: string
  type?: SketchGeometryType
  positions?: Array<[number, number, number]>
  extrudedHeight?: number
}

export type SketchFeature = Feature<
  Polygon | MultiPolygon,
  SketchFeatureProperties
>

export type GeometryFeature = SetRequired<Feature<Polygon | MultiPolygon>, 'id'>
