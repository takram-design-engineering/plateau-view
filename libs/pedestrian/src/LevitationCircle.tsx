import {
  CallbackProperty,
  Cartesian3,
  ClassificationType,
  Color,
  ColorMaterialProperty,
  type PositionProperty
} from '@cesium/engine'
import { useTheme } from '@mui/material'
import { animate, useMotionValue, usePresence } from 'framer-motion'
import { useEffect, useMemo, useRef, type FC } from 'react'

import { Entity, useCesium, type EntityProps } from '@takram/plateau-cesium'
import { useConstant } from '@takram/plateau-react-helpers'

import { type MotionPosition } from './useMotionPosition'

export interface LevitationCircleProps {
  motionPosition: MotionPosition
  offset: Cartesian3
}

const positionScratch = new Cartesian3()

export const LevitationCircle: FC<LevitationCircleProps> = ({
  motionPosition,
  offset
}) => {
  const scene = useCesium(({ scene }) => scene)

  const motionLevitation = useMotionValue(0)
  const [present, safeToRemove] = usePresence()
  useEffect(() => {
    return animate(motionLevitation, present ? 1 : 0, {
      type: 'tween',
      duration: 0.2,
      onComplete: () => {
        if (!present) {
          safeToRemove()
        }
      }
    }).stop
  }, [motionLevitation, present, safeToRemove])

  useEffect(() => {
    return motionLevitation.on('change', () => {
      scene.requestRender()
    })
  }, [scene, motionLevitation])

  const positionPropertyCallback = (): Cartesian3 => {
    const position = Cartesian3.fromElements(
      ...motionPosition.get(),
      positionScratch
    )
    return Cartesian3.add(position, offset, position)
  }
  const positionPropertyCallbackRef = useRef(positionPropertyCallback)
  positionPropertyCallbackRef.current = positionPropertyCallback

  const positionProperty = useConstant(
    () =>
      new CallbackProperty(
        () => positionPropertyCallbackRef.current(),
        false
      ) as unknown as PositionProperty
  )

  const semiAxisProperty = useMemo(
    () =>
      new CallbackProperty(
        () => Math.max(0.1, motionLevitation.get() * 25),
        false
      ),
    [motionLevitation]
  )

  const theme = useTheme()
  const entityOptions = useMemo(
    (): EntityProps => ({
      position: positionProperty,
      ellipse: {
        semiMajorAxis: semiAxisProperty,
        semiMinorAxis: semiAxisProperty,
        fill: true,
        material: new ColorMaterialProperty(
          Color.fromCssColorString(theme.palette.primary.main).withAlpha(0.2)
        ),
        classificationType: ClassificationType.TERRAIN
      }
    }),
    [theme, positionProperty, semiAxisProperty]
  )

  return <Entity {...entityOptions} />
}
