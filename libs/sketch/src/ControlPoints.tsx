import {
  CallbackProperty,
  HeightReference,
  type Cartesian3,
  type PositionProperty
} from '@cesium/engine'
import { useMemo, useRef, type FC } from 'react'
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

export interface ControlPointsProps {
  geometryOptions: GeometryOptions
}

export const ControlPoints: FC<ControlPointsProps> = ({ geometryOptions }) => {
  return geometryOptions.controlPoints.map((controlPoint, index) => (
    <ControlPoint key={index} position={controlPoint} />
  ))
}
