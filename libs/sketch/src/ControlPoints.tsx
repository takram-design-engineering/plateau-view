import {
  CallbackProperty,
  Cartesian3,
  ClassificationType,
  HeightReference,
  PolylineDashMaterialProperty,
  type Color,
  type PositionProperty
} from '@cesium/engine'
import { memo, useMemo, useRef, type FC } from 'react'
import invariant from 'tiny-invariant'

import { Entity, useCesium, type EntityProps } from '@takram/plateau-cesium'
import { useConstant } from '@takram/plateau-react-helpers'

import { type GeometryOptions } from './createGeometry'

let image: HTMLCanvasElement | undefined

function getImage(): HTMLCanvasElement {
  if (image != null) {
    return image
  }
  image = document.createElement('canvas')
  image.width = 16
  image.height = 16
  const context = image.getContext('2d')
  invariant(context != null)
  context.fillStyle = '#ffffff'
  context.fillRect(3, 3, 10, 10)
  context.strokeStyle = '#000000'
  context.lineWidth = 2
  context.strokeRect(3, 3, 10, 10)
  return image
}

const ControlPoint: FC<{
  position: Cartesian3
}> = ({ position }) => {
  const positionRef = useRef(position)
  positionRef.current = position
  const positionProperty = useConstant(
    () =>
      new CallbackProperty(
        () => positionRef.current,
        false
      ) as unknown as PositionProperty
  )

  const options = useMemo(
    (): EntityProps => ({
      position: positionProperty,
      billboard: {
        image: getImage(),
        width: 8,
        height: 8,
        heightReference: HeightReference.CLAMP_TO_GROUND,
        disableDepthTestDistance: Infinity
      }
    }),
    [positionProperty]
  )

  const scene = useCesium(({ scene }) => scene)
  scene.requestRender()

  return <Entity {...options} />
}

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

export interface ControlPointsProps {
  geometryOptions: GeometryOptions
  color?: Color
}

const cartesianScratch1 = new Cartesian3()
const cartesianScratch2 = new Cartesian3()

export const ControlPoints: FC<ControlPointsProps> = memo(
  ({ geometryOptions: { type, controlPoints: controlPointsProp }, color }) => {
    let controlPoints = controlPointsProp
    let measurementPoints: [Cartesian3, Cartesian3] | undefined
    if (type === 'circle' && controlPoints.length === 2) {
      measurementPoints = [controlPoints[0], controlPoints[1]]
    } else if (type === 'rectangle' && controlPoints.length === 3) {
      const [p1, p2, p3] = controlPoints
      const projection = Cartesian3.projectVector(
        Cartesian3.subtract(p3, p1, cartesianScratch1),
        Cartesian3.subtract(p2, p1, cartesianScratch2),
        cartesianScratch1
      )
      const offset = Cartesian3.subtract(
        p3,
        Cartesian3.add(p1, projection, cartesianScratch1),
        cartesianScratch2
      )
      const p4 = Cartesian3.midpoint(p1, p2, cartesianScratch1)
      const p5 = Cartesian3.add(p4, offset, cartesianScratch2)
      controlPoints = [p1, p2, p5]
      measurementPoints = [p4, p5]
    }
    return (
      <>
        {controlPoints.map((controlPoint, index) => (
          <ControlPoint key={index} position={controlPoint} />
        ))}
        {measurementPoints != null && (
          <MeasurementLine
            a={measurementPoints[0]}
            b={measurementPoints[1]}
            color={color}
          />
        )}
      </>
    )
  }
)
