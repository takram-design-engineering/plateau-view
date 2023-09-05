import {
  CallbackProperty,
  Cartesian3,
  Cartographic,
  ClassificationType,
  EllipsoidGeodesic,
  PolylineDashMaterialProperty,
  type Color,
  type PositionProperty
} from '@cesium/engine'
import { useMemo, useRef, type FC } from 'react'

import {
  Entity,
  ScreenSpaceElement,
  useCesium,
  type EntityProps
} from '@takram/plateau-cesium'
import { useConstant } from '@takram/plateau-react-helpers'

import { MeasurementText } from './MeasurementText'

const MeasurementLine: FC<{
  a: Cartesian3
  b: Cartesian3
  color?: Color
}> = ({ a, b, color }) => {
  const controlPointsRef = useRef([a, b])
  controlPointsRef.current = [a, b]
  const positionsProperty = useConstant(
    () =>
      new CallbackProperty(
        () => controlPointsRef.current,
        false
      ) as unknown as PositionProperty
  )

  const options = useMemo(
    (): EntityProps => ({
      polyline: {
        positions: positionsProperty,
        width: 1.5,
        material: new PolylineDashMaterialProperty({
          color,
          dashLength: 8
        }),
        classificationType: ClassificationType.TERRAIN,
        clampToGround: true
      }
    }),
    [color, positionsProperty]
  )

  const scene = useCesium(({ scene }) => scene)
  scene.requestRender()

  return <Entity {...options} />
}

export interface SurfaceMeasurementProps {
  a: Cartesian3
  b: Cartesian3
  color?: Color
  showLine?: boolean
}

const cartographicScratch1 = new Cartographic()
const cartographicScratch2 = new Cartographic()

export const SurfaceMeasurement: FC<SurfaceMeasurementProps> = ({
  a,
  b,
  color,
  showLine = false
}) => {
  const position = useConstant(() => new Cartesian3())
  const scene = useCesium(({ scene }) => scene)
  const geodesic = useMemo(
    () => new EllipsoidGeodesic(undefined, undefined, scene.globe.ellipsoid),
    [scene]
  )
  geodesic.setEndPoints(
    Cartographic.fromCartesian(a, scene.globe.ellipsoid, cartographicScratch1),
    Cartographic.fromCartesian(b, scene.globe.ellipsoid, cartographicScratch2)
  )
  const distance = geodesic.surfaceDistance
  return (
    <>
      <ScreenSpaceElement position={Cartesian3.midpoint(a, b, position)}>
        <MeasurementText>
          {distance < 1000
            ? `${distance.toFixed(1)} m`
            : `${(distance / 1000).toFixed(1)} km`}
        </MeasurementText>
      </ScreenSpaceElement>
      {showLine && <MeasurementLine a={a} b={b} color={color} />}
    </>
  )
}
