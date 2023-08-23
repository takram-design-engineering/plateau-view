import { Color, HeightReference, ShadowMode } from '@cesium/engine'
import { type Feature, type MultiPolygon, type Polygon } from 'geojson'
import { useAtomValue, type PrimitiveAtom } from 'jotai'
import { useMemo, type FC } from 'react'

import { Entity, type EntityProps } from '@takram/plateau-cesium'
import { convertPolygonToHierarchyArray } from '@takram/plateau-cesium-helpers'
import { type SplitAtom } from '@takram/plateau-type-helpers'

import { type SketchFeature } from './types'

type DrawableFeature = Feature<
  Polygon | MultiPolygon,
  { extrudedHeight: number }
>

function isDrawableFeature(feature: Feature): feature is DrawableFeature {
  return (
    (feature.geometry.type === 'Polygon' ||
      feature.geometry.type === 'MultiPolygon') &&
    typeof feature.properties?.extrudedHeight === 'number'
  )
}

const SketchObject: FC<{
  feature: DrawableFeature
}> = ({ feature }) => {
  const entityOptions = useMemo(
    (): EntityProps => ({
      polygon: {
        hierarchy: convertPolygonToHierarchyArray(feature.geometry)[0],
        extrudedHeight: feature.properties.extrudedHeight,
        extrudedHeightReference: HeightReference.RELATIVE_TO_GROUND,
        fill: true,
        material: Color.WHITE,
        // TODO: Make this configurable and connect to the global state.
        shadows: ShadowMode.ENABLED
      }
    }),
    [feature]
  )
  return <Entity {...entityOptions} />
}

export interface SketchProps {
  featuresAtom: PrimitiveAtom<SketchFeature[]>
  featureAtomsAtom: SplitAtom<SketchFeature>
}

export const Sketch: FC<SketchProps> = ({ featuresAtom, featureAtomsAtom }) => {
  const features = useAtomValue(featuresAtom)
  return (
    <>
      {features.map(
        (feature, index) =>
          isDrawableFeature(feature) && (
            <SketchObject key={index} feature={feature} />
          )
      )}
    </>
  )
}
