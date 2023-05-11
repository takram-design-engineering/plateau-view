import { union } from '@turf/turf'
import { type Feature, type MultiPolygon, type Polygon } from 'geojson'
import { omit } from 'lodash'
import {
  useMemo,
  type ComponentType,
  type ElementType,
  type ReactElement
} from 'react'

import { type PolygonEntityProps } from './PolygonEntity'
import { type PolylineEntityProps } from './PolylineEntity'

export type UnionProps<P extends PolygonEntityProps | PolylineEntityProps> =
  Omit<P, 'feature'> & {
    of: ComponentType<P>
    features: Array<Feature<Polygon | MultiPolygon>>
  }

export const Union = <P extends PolygonEntityProps | PolylineEntityProps>({
  of,
  features,
  ...props
}: UnionProps<P>): ReactElement | null => {
  const unionFeature = useMemo(() => {
    const unionFeature = features.reduce(
      (unionFeature: Feature<Polygon | MultiPolygon> | null, feature) =>
        unionFeature != null ? union(unionFeature, feature) : feature,
      null
    )
    return unionFeature != null ? omit(unionFeature, 'id') : undefined
  }, [features])

  const Component: ElementType = of
  return unionFeature != null ? (
    <Component {...props} feature={unionFeature} />
  ) : null
}
