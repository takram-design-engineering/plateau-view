import {
  Cartesian2,
  Cartesian3,
  Color,
  DistanceDisplayCondition,
  HeightReference,
  type Billboard
} from '@cesium/engine'
import { useTheme } from '@mui/material'
import { useEffect, useRef, type FC } from 'react'

import { useCesium, usePreRender } from '@takram/plateau-cesium'

import balloonImage from './assets/balloon.png'
import iconImage from './assets/icon.png'
import { getPosition } from './getPosition'
import { type Location } from './types'
import { useMotionLocation } from './useMotionLocation'

export interface PedestrianObjectProps {
  id?: string
  location: Location
  selected?: boolean
}

const positionScratch = new Cartesian3()

export const PedestrianObject: FC<PedestrianObjectProps> = ({
  id,
  location,
  selected = false
}) => {
  const billboards = useCesium(({ billboards }) => billboards)
  const balloonRef = useRef<Billboard>()
  const iconRef = useRef<Billboard>()

  useEffect(() => {
    if (billboards.isDestroyed()) {
      return
    }
    const distanceDisplayCondition = new DistanceDisplayCondition(0, 1e4)
    const balloon = billboards.add({
      id,
      // @ts-expect-error TODO: Declare Next.js image type
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
      // @ts-expect-error TODO: Declare Next.js image type
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

  const motionLocation = useMotionLocation(location)

  useEffect(() => {
    return motionLocation.on('change', () => {
      scene.requestRender()
    })
  }, [scene, motionLocation])

  usePreRender(() => {
    const position = getPosition(motionLocation.get(), scene, positionScratch)
    const balloon = balloonRef.current
    if (balloon != null) {
      balloon.position = position
    }
    const icon = iconRef.current
    if (icon != null) {
      icon.position = position
    }
  })

  return null
}
