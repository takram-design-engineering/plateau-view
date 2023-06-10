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
import { nanoid } from 'nanoid'
import { useEffect, useMemo, useRef, useState, type FC } from 'react'

import {
  Entity,
  requestRenderInNextFrame,
  useCesium,
  type EntityProps
} from '@takram/plateau-cesium'
import { JapanSeaLevelEllipsoid } from '@takram/plateau-datasets'
import { useConstant, withEphemerality } from '@takram/plateau-react-helpers'
import {
  useScreenSpaceSelectionResponder,
  type ScreenSpaceSelectionEntry
} from '@takram/plateau-screen-space-selection'

import billboard from './assets/billboard.png'

export const PEDESTRIAN_ENTITY = 'PEDESTRIAN_ENTITY'

declare module '@takram/plateau-screen-space-selection' {
  interface ScreenSpaceSelectionOverrides {
    [PEDESTRIAN_ENTITY]: string
  }
}

export interface PedestrianEntityProperties {
  longitude: number
  latitude: number
  height: number
}

interface PedestrianEntityProps {
  id?: string
  longitude: number
  latitude: number
  height?: number
  selected?: boolean
}

const PedestrianEntity: FC<PedestrianEntityProps> = ({
  id,
  longitude,
  latitude,
  height = 2,
  selected = false
}) => {
  const defaultId = useConstant(() => nanoid())
  const entityOptions = useMemo<EntityProps>(() => {
    const properties: PedestrianEntityProperties = {
      longitude,
      latitude,
      height
    }
    return {
      id: `Pedestrian:${id ?? defaultId}`,
      position: Cartesian3.fromDegrees(
        longitude,
        latitude,
        height,
        JapanSeaLevelEllipsoid
      ),
      billboard: {
        image: billboard.src,
        width: 64,
        height: 64,
        pixelOffset: new Cartesian2(32, -32),
        imageSubRegion: new BoundingRectangle(0, 128, 128, 128),
        heightReference: HeightReference.RELATIVE_TO_GROUND
      },
      properties
    }
  }, [longitude, latitude, height, id, defaultId])

  const entityRef = useRef<CesiumEntity>(null)
  const scene = useCesium(({ scene }) => scene)
  useEffect(() => {
    const entity = entityRef.current
    if (entity == null) {
      return
    }
    const imageSubRegion = entity.billboard?.imageSubRegion
    if (!(imageSubRegion instanceof ConstantProperty)) {
      return
    }
    if (selected) {
      imageSubRegion.setValue(new BoundingRectangle(0, 0, 128, 128))
    } else {
      imageSubRegion.setValue(new BoundingRectangle(0, 128, 128, 128))
    }
    requestRenderInNextFrame(scene)
  }, [selected, scene])

  return <Entity ref={entityRef} {...entityOptions} />
}

export interface PedestrianProps
  extends Omit<PedestrianEntityProps, 'selected'> {}

const cartographicScratch = new Cartographic()

export const Pedestrian: FC<PedestrianProps> = withEphemerality(
  () => useCesium(({ scene }) => scene),
  [],
  props => {
    const [selected, setSelected] = useState(false)
    const scene = useCesium(({ scene }) => scene)

    useScreenSpaceSelectionResponder({
      type: PEDESTRIAN_ENTITY,
      transform: object => {
        return 'id' in object &&
          object.id instanceof CesiumEntity &&
          object.id.id.startsWith('Pedestrian:')
          ? {
              type: PEDESTRIAN_ENTITY,
              value: object.id.id
            }
          : undefined
      },
      predicate: (
        value
      ): value is ScreenSpaceSelectionEntry<typeof PEDESTRIAN_ENTITY> => {
        return value.type === PEDESTRIAN_ENTITY
      },
      onSelect: () => {
        setSelected(true)
      },
      onDeselect: () => {
        setSelected(false)
      },
      computeBoundingSphere: (value, result = new BoundingSphere()) => {
        const { longitude, latitude, height = 0 } = props
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

    return <PedestrianEntity {...props} selected={selected} />
  }
)
