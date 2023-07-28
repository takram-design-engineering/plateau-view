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
  streetViewLocationAtom: PrimitiveAtom<Location | null>
}

export function createPedestrianLayer(
  params: PedestrianLayerModelParams
): SetOptional<PedestrianLayerModel, 'id'> {
  const locationAtom = atom<Location>({
    longitude: params.location.longitude,
    latitude: params.location.latitude,
    height: 2.5
  })
  const headingPitchAtom = atom<HeadingPitch | null>(
    params.headingPitchAtom ?? null
  )
  const zoomAtom = atom<number | null>(params.zoomAtom ?? null)

  const targetLocationAtom = atom<Location | null>(null)
  const actualLocationAtom = atom<Location | null>(null)
  const streetViewLocationAtom = atom(
    get => {
      const location = get(locationAtom)
      const target = get(targetLocationAtom)
      const actual = get(actualLocationAtom)
      return target?.longitude === location.longitude &&
        target?.latitude === location.latitude
        ? actual
        : null
    },
    (get, set, value: SetStateAction<Location | null>) => {
      set(targetLocationAtom, get(locationAtom))
      set(actualLocationAtom, value)
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
    zoomAtom,
    synchronizeStreetViewAtom: atom(false),
    streetViewLocationAtom
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
  synchronizeStreetViewAtom,
  streetViewLocationAtom
}) => {
  const [location, setLocation] = useAtom(locationAtom)
  const headingPitch = useAtomValue(headingPitchAtom)
  const zoom = useAtomValue(zoomAtom)
  const synchronizeStreetView = useAtomValue(synchronizeStreetViewAtom)
  const streetViewLocation = useAtomValue(streetViewLocationAtom)

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
      streetViewLocation={streetViewLocation ?? undefined}
      hideFrustum={synchronizeStreetView}
      onChange={handleChange}
    />
  )
}
