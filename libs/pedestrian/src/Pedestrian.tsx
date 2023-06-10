import {
  BoundingRectangle,
  BoundingSphere,
  Cartesian2,
  Cartesian3,
  Cartographic,
  Entity as CesiumEntity,
  ConstantProperty,
  HeightReference
} from '@cesium/engine'
import { useMemo, useRef, type FC } from 'react'

import {
  Entity,
  requestRenderInNextFrame,
  useCesium,
  type EntityProps
} from '@takram/plateau-cesium'
import { JapanSeaLevelEllipsoid } from '@takram/plateau-datasets'
import {
  useScreenSpaceSelectionResponder,
  type ScreenSpaceSelectionEntry
} from '@takram/plateau-screen-space-selection'

import icon from './assets/icon.png'

export const PEDESTRIAN_ENTITY = 'PEDESTRIAN_ENTITY'

declare module '@takram/plateau-screen-space-selection' {
  interface ScreenSpaceSelectionOverrides {
    [PEDESTRIAN_ENTITY]: string
  }
}

export interface PedestrianProps {
  longitude: number
  latitude: number
  height?: number
}

const cartographicScratch = new Cartographic()

export const Pedestrian: FC<PedestrianProps> = ({
  longitude,
  latitude,
  height = 2
}) => {
  const entityRef = useRef<CesiumEntity>(null)

  const entityOptions = useMemo<EntityProps>(() => {
    return {
      position: Cartesian3.fromDegrees(
        longitude,
        latitude,
        height,
        JapanSeaLevelEllipsoid
      ),
      billboard: {
        image: icon.src,
        width: 32,
        height: 32,
        pixelOffset: new Cartesian2(16, -16),
        imageSubRegion: new BoundingRectangle(0, 72, 64, 64),
        heightReference: HeightReference.RELATIVE_TO_GROUND
      }
    }
  }, [longitude, latitude, height])

  const scene = useCesium(({ scene }) => scene)
  useScreenSpaceSelectionResponder({
    type: PEDESTRIAN_ENTITY,
    transform: object => {
      if (entityRef.current == null) {
        return
      }
      return 'id' in object &&
        object.id instanceof CesiumEntity &&
        object.id.id === entityRef.current.id
        ? {
            type: PEDESTRIAN_ENTITY,
            value: entityRef.current.id
          }
        : undefined
    },
    predicate: (
      value
    ): value is ScreenSpaceSelectionEntry<typeof PEDESTRIAN_ENTITY> => {
      return value.type === PEDESTRIAN_ENTITY
    },
    onSelect: value => {
      const imageSubRegion = entityRef.current?.billboard?.imageSubRegion
      if (imageSubRegion instanceof ConstantProperty) {
        imageSubRegion.setValue(new BoundingRectangle(0, 0, 64, 64))
        requestRenderInNextFrame(scene)
      }
    },
    onDeselect: value => {
      const imageSubRegion = entityRef.current?.billboard?.imageSubRegion
      if (imageSubRegion instanceof ConstantProperty) {
        imageSubRegion.setValue(new BoundingRectangle(0, 72, 64, 64))
        requestRenderInNextFrame(scene)
      }
    },
    computeBoundingSphere: (value, result = new BoundingSphere()) => {
      Cartesian3.fromDegrees(
        longitude,
        latitude,
        (scene.globe.getHeight(
          Cartographic.fromDegrees(
            longitude,
            latitude,
            height,
            cartographicScratch
          )
        ) ?? 0) + height,
        undefined,
        result.center
      )
      result.radius = 50 // Arbitrary size
      return result
    }
  })

  return <Entity ref={entityRef} {...entityOptions} />
}
