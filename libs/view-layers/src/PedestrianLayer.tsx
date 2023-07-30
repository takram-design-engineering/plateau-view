import {
  atom,
  useAtom,
  useAtomValue,
  type PrimitiveAtom,
  type SetStateAction
} from 'jotai'
import { useCallback, useMemo, type FC } from 'react'
import { type SetOptional } from 'type-fest'

import { match } from '@takram/plateau-cesium-helpers'
import { type LayerProps } from '@takram/plateau-layers'
import {
  Pedestrian,
  PEDESTRIAN_OBJECT,
  type HeadingPitch,
  type Location
} from '@takram/plateau-pedestrian'
import { screenSpaceSelectionAtom } from '@takram/plateau-screen-space-selection'

import {
  createViewLayerBase,
  type ViewLayerModel,
  type ViewLayerModelParams
} from './createViewLayerBase'
import { PEDESTRIAN_LAYER } from './layerTypes'

export interface PedestrianLayerModelParams extends ViewLayerModelParams {
  location: Location
  headingPitchAtom?: HeadingPitch
  zoomAtom?: number
}

export interface PedestrianLayerModel extends ViewLayerModel {
  locationAtom: PrimitiveAtom<Location>
  headingPitchAtom: PrimitiveAtom<HeadingPitch | null>
  zoomAtom: PrimitiveAtom<number | null>
  synchronizeStreetViewAtom: PrimitiveAtom<boolean>
}

export function createPedestrianLayer(
  params: PedestrianLayerModelParams
): SetOptional<PedestrianLayerModel, 'id'> {
  const locationPrimitiveAtom = atom<Location>({
    longitude: params.location.longitude,
    latitude: params.location.latitude,
    height: 2.5
  })
  const locationAtom = atom(
    get => get(locationPrimitiveAtom),
    (get, set, value: SetStateAction<Location>) => {
      const prevValue = get(locationPrimitiveAtom)
      const nextValue = typeof value === 'function' ? value(prevValue) : value
      if (
        nextValue.longitude !== prevValue.longitude ||
        nextValue.latitude !== prevValue.latitude ||
        nextValue.height !== prevValue.height
      ) {
        set(locationPrimitiveAtom, nextValue)
      }
    }
  )

  const headingPitchPrimitiveAtom = atom<HeadingPitch | null>(
    params.headingPitchAtom ?? null
  )
  const headingPitchAtom = atom(
    get => get(headingPitchPrimitiveAtom),
    (get, set, value: SetStateAction<HeadingPitch | null>) => {
      const prevValue = get(headingPitchAtom)
      const nextValue = typeof value === 'function' ? value(prevValue) : value
      if (
        nextValue?.heading !== prevValue?.heading ||
        nextValue?.pitch !== prevValue?.pitch
      ) {
        set(headingPitchPrimitiveAtom, nextValue)
      }
    }
  )

  return {
    ...createViewLayerBase({
      ...params,
      title: '歩行者視点'
    }),
    type: PEDESTRIAN_LAYER,
    locationAtom,
    headingPitchAtom,
    zoomAtom: atom<number | null>(params.zoomAtom ?? null),
    synchronizeStreetViewAtom: atom(false)
  }
}

export const PedestrianLayer: FC<LayerProps<typeof PEDESTRIAN_LAYER>> = ({
  id,
  selected,
  hiddenAtom,
  boundingSphereAtom,
  locationAtom,
  headingPitchAtom,
  zoomAtom,
  synchronizeStreetViewAtom
}) => {
  const [location, setLocation] = useAtom(locationAtom)
  const headingPitch = useAtomValue(headingPitchAtom)
  const zoom = useAtomValue(zoomAtom)
  const synchronizeStreetView = useAtomValue(synchronizeStreetViewAtom)

  const selection = useAtomValue(screenSpaceSelectionAtom)
  const objectSelected = useMemo(
    () =>
      selection.length > 0 &&
      selection.every(
        ({ type, value }) =>
          type === PEDESTRIAN_OBJECT && match(value, { key: id })
      ),
    [id, selection]
  )

  const handleChange = useCallback(
    (location: Location) => {
      setLocation(location)
    },
    [setLocation]
  )

  const hidden = useAtomValue(hiddenAtom)
  if (hidden) {
    return null
  }
  return (
    <Pedestrian
      id={id}
      selected={selected === true || objectSelected}
      location={location}
      headingPitch={headingPitch ?? undefined}
      zoom={zoom ?? undefined}
      hideFrustum={synchronizeStreetView}
      onChange={handleChange}
    />
  )
}
