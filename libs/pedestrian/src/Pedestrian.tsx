import { BoundingSphere } from '@cesium/engine'
import { AnimatePresence } from 'framer-motion'
import { nanoid } from 'nanoid'
import { useState, type FC } from 'react'

import { useCesium } from '@takram/plateau-cesium'
import { compose } from '@takram/plateau-cesium-helpers'
import { useConstant, withEphemerality } from '@takram/plateau-react-helpers'
import {
  useScreenSpaceSelectionResponder,
  type ScreenSpaceSelectionEntry
} from '@takram/plateau-screen-space-selection'

import { PedestrianObject } from './PedestrianObject'
import { StreetViewFrustum } from './StreetViewFrustum'
import { getPosition } from './getPosition'
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
  streetViewLocation?: Location
  streetViewHeadingPitch?: HeadingPitch
  streetViewZoom?: number
  onChange?: (location: Location) => void
}

export const Pedestrian: FC<PedestrianProps> = withEphemerality(
  () => useCesium(({ scene }) => scene),
  [],
  ({
    id,
    selected = false,
    location,
    streetViewLocation,
    streetViewHeadingPitch,
    streetViewZoom
  }) => {
    const defaultId = useConstant(() => nanoid())
    const objectId = compose({ type: 'Pedestrian', key: id ?? defaultId })

    const [highlighted, setHighlighted] = useState(false)
    const scene = useCesium(({ scene }) => scene)

    useScreenSpaceSelectionResponder({
      type: PEDESTRIAN_OBJECT,
      transform: object => {
        return 'id' in object && object.id === objectId
          ? {
              type: PEDESTRIAN_OBJECT,
              value: objectId
            }
          : undefined
      },
      predicate: (
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
        getPosition(location, scene, result.center)
        result.radius = 50 // Arbitrary size
        return result
      }
    })

    return (
      <>
        <PedestrianObject
          id={objectId}
          location={streetViewLocation ?? location}
          selected={selected || highlighted}
        />
        <AnimatePresence>
          {selected &&
            streetViewLocation != null &&
            streetViewHeadingPitch != null && (
              <StreetViewFrustum
                location={streetViewLocation}
                headingPitch={streetViewHeadingPitch}
                zoom={streetViewZoom}
              />
            )}
        </AnimatePresence>
      </>
    )
  }
)
