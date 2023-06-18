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

export interface PedestrianLayerModelParams
  extends ViewLayerModelParams,
    Location {}

export interface PedestrianLayerModel extends ViewLayerModel {
  locationAtom: PrimitiveAtom<Location>
  synchronizeStreetViewAtom: PrimitiveAtom<boolean>
  streetViewLocationAtom: PrimitiveAtom<Location | null>
  streetViewHeadingPitchAtom: PrimitiveAtom<HeadingPitch | null>
  streetViewZoomAtom: PrimitiveAtom<number | null>
}

export function createPedestrianLayer(
  params: PedestrianLayerModelParams
): SetOptional<PedestrianLayerModel, 'id'> {
  const locationAtom = atom<Location>({
    longitude: params.longitude,
    latitude: params.latitude,
    height: 2.5
  })
  const streetViewTargetLocationAtom = atom<Location | null>(null)
  const streetViewActualLocationAtom = atom<Location | null>(null)
  const streetViewLocationAtom = atom(
    get => {
      const target = get(streetViewTargetLocationAtom)
      const location = get(locationAtom)
      return target?.longitude === location.longitude &&
        target?.latitude === location.latitude
        ? get(streetViewActualLocationAtom)
        : null
    },
    (get, set, value: SetStateAction<Location | null>) => {
      set(streetViewTargetLocationAtom, get(locationAtom))
      set(streetViewActualLocationAtom, value)
    }
  )
  return {
    ...createViewLayerBase({
      ...params,
      title: '歩行者視点'
    }),
    type: PEDESTRIAN_LAYER,
    locationAtom,
    synchronizeStreetViewAtom: atom(false),
    streetViewLocationAtom,
    streetViewHeadingPitchAtom: atom<HeadingPitch | null>(null),
    streetViewZoomAtom: atom<number | null>(null)
  }
}

export const PedestrianLayer: FC<LayerProps<typeof PEDESTRIAN_LAYER>> = ({
  id,
  selected,
  hiddenAtom,
  boundingSphereAtom,
  locationAtom,
  synchronizeStreetViewAtom,
  streetViewLocationAtom,
  streetViewHeadingPitchAtom,
  streetViewZoomAtom
}) => {
  const [location, setLocation] = useAtom(locationAtom)
  const synchronizeStreetView = useAtomValue(synchronizeStreetViewAtom)
  const streetViewLocation = useAtomValue(streetViewLocationAtom)
  const streetViewHeadingPitch = useAtomValue(streetViewHeadingPitchAtom)
  const streetViewZoom = useAtomValue(streetViewZoomAtom)

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
      streetViewLocation={streetViewLocation ?? undefined}
      streetViewHeadingPitch={streetViewHeadingPitch ?? undefined}
      streetViewZoom={streetViewZoom ?? undefined}
      hideFrustum={synchronizeStreetView}
      onChange={handleChange}
    />
  )
}
