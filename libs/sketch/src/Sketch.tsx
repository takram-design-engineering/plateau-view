import { type Feature } from 'geojson'
import { useAtomValue, type PrimitiveAtom } from 'jotai'
import { type FC } from 'react'

import { SketchObject } from './SketchObject'
import { type SketchFeature } from './types'

type DrawableFeature = SketchFeature & {
  properties: {
    extrudedHeight: number
  }
}

function isDrawableFeature(feature: Feature): feature is DrawableFeature {
  return (
    (feature.geometry.type === 'Polygon' ||
      feature.geometry.type === 'MultiPolygon') &&
    typeof feature.properties?.extrudedHeight === 'number'
  )
}

export interface SketchProps {
  featuresAtom: PrimitiveAtom<SketchFeature[]>
}

export const Sketch: FC<SketchProps> = ({ featuresAtom }) => {
  const features = useAtomValue(featuresAtom)
  return (
    <>
      {features.map(
        (feature, index) =>
          isDrawableFeature(feature) && (
            <SketchObject
              key={index}
              geometry={feature.geometry}
              extrudedHeight={feature.properties.extrudedHeight}
            />
          )
      )}
    </>
  )
}
