import { CallbackProperty, Cartesian3, type Color } from '@cesium/engine'
import { memo, useRef, type FC } from 'react'

import { useCesium } from '@takram/plateau-cesium'
import { useConstant } from '@takram/plateau-react-helpers'

import { ControlPoint } from './ControlPoint'
import { type GeometryOptions } from './createGeometry'
import { ExtrudedMeasurement } from './ExtrudedMeasurement'

export interface ExtrudedControlPointsProps {
  geometryOptions: GeometryOptions
  extrudedHeight: number
  color?: Color
}

const cartesianScratch = new Cartesian3()

export const ExtrudedControlPoints: FC<ExtrudedControlPointsProps> = memo(
  ({ geometryOptions: { controlPoints }, extrudedHeight, color }) => {
    const scene = useCesium(({ scene }) => scene)

    const controlPoint = controlPoints[controlPoints.length - 1]
    const normal = scene.globe.ellipsoid.geodeticSurfaceNormal(
      controlPoint,
      cartesianScratch
    )
    const extrudedPoint = Cartesian3.add(
      controlPoint,
      Cartesian3.multiplyByScalar(normal, extrudedHeight, cartesianScratch),
      cartesianScratch
    )

    const extrudedPointRef = useRef(extrudedPoint)
    extrudedPointRef.current = extrudedPoint
    const extrudedPointProperty = useConstant(
      () => new CallbackProperty(() => extrudedPointRef.current, false)
    )

    return (
      <>
        <ControlPoint position={controlPoint} clampToGround />
        <ControlPoint position={extrudedPointProperty} />
        <ExtrudedMeasurement
          a={controlPoint}
          b={extrudedPoint}
          extrudedHeight={extrudedHeight}
          color={color}
        />
      </>
    )
  }
)
