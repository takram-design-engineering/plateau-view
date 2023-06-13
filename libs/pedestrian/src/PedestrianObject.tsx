import {
  BoundingRectangle,
  Cartesian2,
  Cartesian3,
  HeightReference,
  type Billboard
} from '@cesium/engine'
import { useEffect, useRef, type FC } from 'react'

import { useCesium, usePreRender } from '@takram/plateau-cesium'

import billboardImage from './assets/billboard.png'
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
  const billboardRef = useRef<Billboard>()

  useEffect(() => {
    if (billboards.isDestroyed()) {
      return
    }
    const billboard = billboards.add({
      id,
      // @ts-expect-error TODO: Declare Next.js image type
      image: billboardImage.src,
      width: 64,
      height: 64,
      pixelOffset: new Cartesian2(16, -16),
      imageSubRegion: new BoundingRectangle(0, 128, 128, 128),
      heightReference: HeightReference.NONE
    })
    billboardRef.current = billboard
    return () => {
      if (!billboards.isDestroyed()) {
        billboards.remove(billboard)
      }
      billboardRef.current = undefined
    }
  }, [id, billboards])

  const scene = useCesium(({ scene }) => scene)

  useEffect(() => {
    const billboard = billboardRef.current
    if (billboard == null) {
      return
    }
    if (selected) {
      billboard.setImageSubRegion(
        // @ts-expect-error TODO: Declare Next.js image type
        billboardImage.src,
        new BoundingRectangle(0, 0, 128, 128)
      )
    } else {
      billboard.setImageSubRegion(
        // @ts-expect-error TODO: Declare Next.js image type
        billboardImage.src,
        new BoundingRectangle(0, 128, 128, 128)
      )
    }
    scene.requestRender()
  }, [selected, scene])

  const motionLocation = useMotionLocation(location)

  useEffect(() => {
    return motionLocation.on('change', () => {
      scene.requestRender()
    })
  }, [scene, motionLocation])

  usePreRender(() => {
    const billboard = billboardRef.current
    if (billboard == null) {
      return
    }
    billboard.position = getPosition(
      motionLocation.get(),
      scene,
      positionScratch
    )
  })

  useEffect(() => {
    return () => {
      scene.requestRender()
    }
  }, [scene])

  return null
}
