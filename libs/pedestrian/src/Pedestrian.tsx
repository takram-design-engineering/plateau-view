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
import { atom, useAtomValue } from 'jotai'
import { nanoid } from 'nanoid'
import { useCallback, useMemo, useState, type FC } from 'react'
import invariant from 'tiny-invariant'

import { useCesium } from '@takram/plateau-cesium'
import { compose, match } from '@takram/plateau-cesium-helpers'
import { layerSelectionAtom } from '@takram/plateau-layers'
import { useConstant, withEphemerality } from '@takram/plateau-react-helpers'
import {
  screenSpaceSelectionAtom,
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
  location: Location
  headingPitch?: HeadingPitch
  zoom?: number
  hideFrustum?: boolean
  onChange?: (location: Location) => void
}

const cartesianScratch = new Cartesian3()
const cartographicScratch = new Cartographic()

export const Pedestrian: FC<PedestrianProps> = withEphemerality(
  () => useCesium(({ scene }) => scene),
  [],
  ({ id, location, headingPitch, zoom, hideFrustum = false, onChange }) => {
    const defaultId = useConstant(() => nanoid())
    const objectId = compose({ type: 'Pedestrian', key: id ?? defaultId })

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
      computeBoundingSphere: (value, result = new BoundingSphere()) => {
        computeCartographicToCartesian(scene, location, result.center)
        result.radius = 200 // Arbitrary size
        return result
      }
    })

    const selected = useAtomValue(
      useMemo(
        () =>
          atom(get => {
            const screenSpaceSelection = get(screenSpaceSelectionAtom)
            const layerSelection = get(layerSelectionAtom)
            return (
              screenSpaceSelection.some(
                ({ type, value }) =>
                  type === PEDESTRIAN_OBJECT &&
                  match(value, { type: 'Pedestrian', key: id })
              ) || layerSelection.some(layerId => layerId === id)
            )
          }),
        [id]
      )
    )

    const [dragKey, setDragKey] = useState(0)
    const [levitated, setLevitated] = useState(false)
    const handleDragStart = useCallback((event: DragStartEvent) => {
      setLevitated(true)
    }, [])
    const handleDragEnd = useCallback(
      (event: DragEndEvent) => {
        const referenceLocation = location
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
        setDragKey(Math.random())
        setLevitated(false)
        onChange?.({
          longitude: CesiumMath.toDegrees(cartographic.longitude),
          latitude: CesiumMath.toDegrees(cartographic.latitude),
          height: referenceLocation.height
        })
      },
      [location, onChange, scene]
    )

    return (
      <DndContext
        autoScroll={false}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <PedestrianObject
          key={dragKey}
          id={objectId}
          location={location}
          selected={selected}
          levitated={levitated}
        />
        <AnimatePresence>
          {selected &&
            !levitated &&
            !hideFrustum &&
            headingPitch != null &&
            zoom != null && (
              <StreetViewFrustum
                location={location}
                headingPitch={headingPitch}
                zoom={zoom}
              />
            )}
        </AnimatePresence>
      </DndContext>
    )
  }
)
