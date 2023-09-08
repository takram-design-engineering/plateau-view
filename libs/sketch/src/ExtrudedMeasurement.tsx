import {
  CallbackProperty,
  Cartesian3,
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

  const options = useMemo((): EntityProps => {
    return {
      polyline: {
        positions: positionsProperty,
        width: 1.5,
        material: new PolylineDashMaterialProperty({
          color,
          dashLength: 8
        })
        // TODO: Want to apply depthFailMaterial but doesn't work with
        // dynamic polyline: https://github.com/CesiumGS/cesium/issues/5333
      }
    }
  }, [color, positionsProperty])

  const scene = useCesium(({ scene }) => scene)
  scene.requestRender()

  return <Entity {...options} />
}

export interface ExtrudedMeasurementProps {
  a: Cartesian3
  b: Cartesian3
  extrudedHeight: number
  color?: Color
}

export const ExtrudedMeasurement: FC<ExtrudedMeasurementProps> = ({
  a,
  b,
  extrudedHeight,
  color
}) => {
  const position = useConstant(() => new Cartesian3())
  return (
    <>
      <ScreenSpaceElement position={Cartesian3.midpoint(a, b, position)}>
        <MeasurementText>
          {extrudedHeight < 1000
            ? `${extrudedHeight.toFixed(1)} m`
            : `${(extrudedHeight / 1000).toFixed(1)} km`}
        </MeasurementText>
      </ScreenSpaceElement>
      <MeasurementLine a={a} b={b} color={color} />
    </>
  )
}
