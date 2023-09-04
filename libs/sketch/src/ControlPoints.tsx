import {
  CallbackProperty,
  Cartesian3,
  Cartographic,
  ClassificationType,
  EllipsoidGeodesic,
  HeightReference,
  PolylineDashMaterialProperty,
  type Color,
  type PositionProperty
} from '@cesium/engine'
import { styled } from '@mui/material'
import { memo, useMemo, useRef, type FC } from 'react'
import invariant from 'tiny-invariant'

import {
  Entity,
  ScreenSpaceElement,
  useCesium,
  type EntityProps
} from '@takram/plateau-cesium'
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
  context.fillStyle = 'white'
  context.fillRect(3, 3, 10, 10)
  context.strokeStyle = 'black'
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

const MeasurementText = styled('div')(({ theme }) => ({
  ...theme.typography.caption,
  padding: theme.spacing(0.5),
  color: theme.palette.getContrastText(theme.palette.primary.dark),
  backgroundColor: theme.palette.primary.main,
  borderRadius: theme.shape.borderRadius,
  lineHeight: 1
}))

const cartographicScratch1 = new Cartographic()
const cartographicScratch2 = new Cartographic()

const Measurement: FC<{
  a: Cartesian3
  b: Cartesian3
  color?: Color
  showLine?: boolean
}> = ({ a, b, color, showLine = false }) => {
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
    let showLine = false
    if (type === 'rectangle' && controlPoints.length === 3) {
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
      showLine = true
    } else if (controlPoints.length > 1) {
      measurementPoints = controlPoints.slice(-2) as [Cartesian3, Cartesian3]
      showLine = type === 'circle'
    }
    return (
      <>
        {controlPoints.map((controlPoint, index) => (
          <ControlPoint key={index} position={controlPoint} />
        ))}
        {measurementPoints != null && (
          <Measurement
            a={measurementPoints[0]}
            b={measurementPoints[1]}
            color={color}
            showLine={showLine}
          />
        )}
      </>
    )
  }
)
