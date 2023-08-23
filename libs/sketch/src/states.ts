import { type PolygonHierarchy } from '@cesium/engine'
import { type Feature, type MultiPolygon, type Polygon } from 'geojson'
import { atom } from 'jotai'
import { splitAtom } from 'jotai/utils'
import { type SetRequired } from 'type-fest'

export type GeometryFeature = SetRequired<Feature<Polygon | MultiPolygon>, 'id'>

export const featuresAtom = atom<GeometryFeature[]>([])
export const featureAtomsAtom = splitAtom(featuresAtom)
export const polygonHierarchyAtom = atom<PolygonHierarchy | null>(null)
