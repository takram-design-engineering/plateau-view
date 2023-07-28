import {
  BoundingSphere,
  Cartesian3,
  Cartographic,
  Math as CesiumMath
} from '@cesium/engine'
import {
  DndContext,
  type DragEndEvent,
  type DragStartEvent
} from '@dnd-kit/core'
import { AnimatePresence } from 'framer-motion'
import { nanoid } from 'nanoid'
import { useCallback, useState, type FC } from 'react'
import invariant from 'tiny-invariant'

import { useCesium } from '@takram/plateau-cesium'
import { compose } from '@takram/plateau-cesium-helpers'
import { useConstant, withEphemerality } from '@takram/plateau-react-helpers'
import {
  useScreenSpaceSelectionResponder,
  type ScreenSpaceSelectionEntry
} from '@takram/plateau-screen-space-selection'

import { computeCartographicToCartesian } from './computeCartographicToCartesian'
import { PedestrianObject } from './PedestrianObject'
import { StreetViewFrustum } from './StreetViewFrustum'
import { type HeadingPitch, type Location } from './types'

export const PEDESTRIAN_OBJECT = 'PEDESTRIAN_OBJECT'

declare module '@takram/plateau-screen-space-selection' {
  interface ScreenSpaceSelectionOverrides {
    [PEDESTRIAN_OBJECT]: string
  }
}

export interface PedestrianProps {
  id?: string
  selected?: boolean
  location: Location
  headingPitch?: HeadingPitch
  zoom?: number
  streetViewLocation?: Location
  hideFrustum?: boolean
  onChange?: (location: Location) => void
}

const cartesianScratch = new Cartesian3()
const cartographicScratch = new Cartographic()

export const Pedestrian: FC<PedestrianProps> = withEphemerality(
  () => useCesium(({ scene }) => scene),
  [],
  ({
    id,
    selected = false,
    location,
    headingPitch,
    zoom,
    streetViewLocation,
    hideFrustum = false,
    onChange
  }) => {
    const defaultId = useConstant(() => nanoid())
    const objectId = compose({ type: 'Pedestrian', key: id ?? defaultId })

    const [highlighted, setHighlighted] = useState(false)
    const scene = useCesium(({ scene }) => scene)

    useScreenSpaceSelectionResponder({
      type: PEDESTRIAN_OBJECT,
      convertToSelection: object => {
        return 'id' in object && object.id === objectId
          ? {
              type: PEDESTRIAN_OBJECT,
              value: objectId
            }
          : undefined
      },
      shouldRespondToSelection: (
        value
      ): value is ScreenSpaceSelectionEntry<typeof PEDESTRIAN_OBJECT> => {
        return value.type === PEDESTRIAN_OBJECT && value.value === objectId
      },
      onSelect: () => {
        setHighlighted(true)
      },
      onDeselect: () => {
        setHighlighted(false)
      },
      computeBoundingSphere: (value, result = new BoundingSphere()) => {
        computeCartographicToCartesian(scene, location, result.center)
        result.radius = 50 // Arbitrary size
        return result
      }
    })

    const [levitated, setLevitated] = useState(false)
    const handleDragStart = useCallback((event: DragStartEvent) => {
      setLevitated(true)
    }, [])
    const handleDragEnd = useCallback(
      (event: DragEndEvent) => {
        const referenceLocation = streetViewLocation ?? location
        const offset = event.active.data.current
        invariant(offset instanceof Cartesian3)
        const position = Cartesian3.fromDegrees(
          referenceLocation.longitude,
          referenceLocation.latitude,
          referenceLocation.height,
          scene.globe.ellipsoid,
          cartesianScratch
        )
        Cartesian3.add(position, offset, position)
        const cartographic = Cartographic.fromCartesian(
          position,
          scene.globe.ellipsoid,
          cartographicScratch
        )
        setLevitated(false)
        onChange?.({
          longitude: CesiumMath.toDegrees(cartographic.longitude),
          latitude: CesiumMath.toDegrees(cartographic.latitude),
          height: referenceLocation.height
        })
      },
      [location, streetViewLocation, onChange, scene]
    )

    return (
      <DndContext
        autoScroll={false}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <PedestrianObject
          id={objectId}
          location={location}
          streetViewLocation={streetViewLocation}
          selected={selected || highlighted}
          levitated={levitated}
        />
        <AnimatePresence>
          {selected &&
            !levitated &&
            !hideFrustum &&
            streetViewLocation != null &&
            headingPitch != null &&
            zoom != null && (
              <StreetViewFrustum
                location={location}
                streetViewLocation={streetViewLocation}
                headingPitch={headingPitch}
                zoom={zoom}
              />
            )}
        </AnimatePresence>
      </DndContext>
    )
  }
)
