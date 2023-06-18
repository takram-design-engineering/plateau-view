import {
  Cartesian2,
  Cartesian3,
  Color,
  DistanceDisplayCondition,
  HeightReference,
  type Billboard
} from '@cesium/engine'
import { useDraggable } from '@dnd-kit/core'
import { useTheme } from '@mui/material'
import { useEffect, useMemo, useRef, type FC } from 'react'

import { useCesium, usePreRender } from '@takram/plateau-cesium'
import { ScreenSpaceElement } from '@takram/plateau-cesium-helpers'
import { withEphemerality } from '@takram/plateau-react-helpers'

import balloonImage from './assets/balloon.png'
import iconImage from './assets/icon.png'
import { computeCartographicToCartesian } from './computeCartographicToCartesian'
import { convertScreenToPositionOffset } from './convertScreenToPositionOffset'
import { type Location } from './types'
import { useMotionPosition } from './useMotionPosition'

interface SensorProps {
  id: string
  position: Cartesian3
  offset: Cartesian3
}

const Sensor: FC<SensorProps> = ({ id, position, offset }) => {
  const { setNodeRef, transform, listeners } = useDraggable({ id })

  const scene = useCesium(({ scene }) => scene)
  useEffect(() => {
    if (transform != null) {
      convertScreenToPositionOffset(scene, position, transform, offset)
    } else {
      Cartesian3.ZERO.clone(offset)
    }
    scene.requestRender()
  }, [position, offset, transform, scene])

  return (
    <ScreenSpaceElement
      ref={setNodeRef}
      position={position}
      style={{
        width: 32,
        height: 32,
        top: -16 + (transform?.y ?? 0),
        left: 16 + (transform?.x ?? 0),
        cursor: 'pointer'
      }}
      {...listeners}
    />
  )
}

export interface PedestrianObjectProps {
  id: string
  location: Location
  selected?: boolean
  levitated?: boolean
  levitationHeight?: number
}

const positionScratch = new Cartesian3()

export const PedestrianObject: FC<PedestrianObjectProps> = withEphemerality(
  () => useCesium(({ scene }) => scene),
  ['id'],
  ({
    id,
    location,
    selected = false,
    levitated = true,
    levitationHeight = 10
  }) => {
    const billboards = useCesium(({ billboards }) => billboards)
    const balloonRef = useRef<Billboard>()
    const iconRef = useRef<Billboard>()

    useEffect(() => {
      if (billboards.isDestroyed()) {
        return
      }
      const distanceDisplayCondition = new DistanceDisplayCondition(10, 1e4)
      const balloon = billboards.add({
        id,
        image: balloonImage.src,
        width: 64,
        height: 64,
        pixelOffset: new Cartesian2(16, -16),
        heightReference: HeightReference.NONE,
        distanceDisplayCondition,
        eyeOffset: new Cartesian3(0, 0, -10)
      })
      const icon = billboards.add({
        id,
        image: iconImage.src,
        width: 24,
        height: 24,
        pixelOffset: new Cartesian2(16, -16),
        heightReference: HeightReference.NONE,
        distanceDisplayCondition,
        // WORKAROUND: Render above balloon.
        eyeOffset: new Cartesian3(0, 0, -10.1)
      })
      balloonRef.current = balloon
      iconRef.current = icon
      return () => {
        if (!billboards.isDestroyed()) {
          billboards.remove(balloon)
          billboards.remove(icon)
        }
        balloonRef.current = undefined
        iconRef.current = undefined
      }
    }, [id, billboards])

    const scene = useCesium(({ scene }) => scene)
    scene.requestRender()
    useEffect(() => {
      return () => {
        scene.requestRender()
      }
    }, [scene])

    const theme = useTheme()

    useEffect(() => {
      const balloon = balloonRef.current
      if (balloon == null) {
        return
      }
      if (selected) {
        balloon.color = Color.fromCssColorString(theme.palette.primary.main)
      } else {
        balloon.color = Color.BLACK
      }
      scene.requestRender()
    }, [selected, scene, theme])

    const position = useMemo(
      () => computeCartographicToCartesian(scene, location),
      [scene, location]
    )
    const motionPosition = useMotionPosition(position)
    const offset = useMemo(() => new Cartesian3(), [])

    useEffect(() => {
      return motionPosition.on('change', () => {
        scene.requestRender()
      })
    }, [scene, motionPosition])

    usePreRender(() => {
      Object.assign(positionScratch, motionPosition.get())
      const position = positionScratch
      Cartesian3.add(position, offset, position)
      const balloon = balloonRef.current
      if (balloon != null) {
        balloon.position = position
      }
      const icon = iconRef.current
      if (icon != null) {
        icon.position = position
      }
    })

    return selected ? (
      <Sensor id={id} position={position} offset={offset} />
    ) : null
  }
)
