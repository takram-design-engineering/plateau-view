import {
  CallbackProperty,
  ClassificationType,
  type Cartesian3,
  type Color
} from '@cesium/engine'
import { useMemo, useRef, type FC } from 'react'

import { Entity, useCesium, type EntityProps } from '@takram/plateau-cesium'
import { useConstant } from '@takram/plateau-react-helpers'

export interface PolylineEntityProps {
  dynamic?: boolean
  positions: Cartesian3[]
  color?: Color
}

export const PolylineEntity: FC<PolylineEntityProps> = ({
  dynamic = false,
  positions: positionsProp,
  color
}) => {
  const positionsRef = useRef(positionsProp)
  positionsRef.current = positionsProp
  const positionsProperty = useConstant(
    () => new CallbackProperty(() => positionsRef.current, !dynamic)
  )
  const positions = dynamic ? positionsProperty : positionsProp

  const options = useMemo(
    (): EntityProps => ({
      polyline: {
        positions,
        width: 1.5,
        material: color,
        classificationType: ClassificationType.TERRAIN,
        clampToGround: true
      }
    }),
    [color, positions]
  )

  const scene = useCesium(({ scene }) => scene)
  scene.requestRender()

  return <Entity {...options} />
}
