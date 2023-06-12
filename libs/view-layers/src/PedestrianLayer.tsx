import { atom, useAtom, useAtomValue, type PrimitiveAtom } from 'jotai'
import { type FC } from 'react'
import { type SetOptional } from 'type-fest'

import { type LayerProps } from '@takram/plateau-layers'
import {
  Pedestrian,
  type HeadingPitch,
  type Location
} from '@takram/plateau-pedestrian'

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
  streetViewLocationAtom: PrimitiveAtom<Location | null>
  streetViewHeadingPitchAtom: PrimitiveAtom<HeadingPitch | null>
  streetViewZoomAtom: PrimitiveAtom<number | null>
}

export function createPedestrianLayer(
  params: PedestrianLayerModelParams
): SetOptional<PedestrianLayerModel, 'id'> {
  return {
    ...createViewLayerBase({
      ...params,
      title: '歩行者視点'
    }),
    type: PEDESTRIAN_LAYER,
    locationAtom: atom<Location>({
      longitude: params.longitude,
      latitude: params.latitude,
      height: 5
    }),
    streetViewLocationAtom: atom<Location | null>(null),
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
  streetViewLocationAtom,
  streetViewHeadingPitchAtom,
  streetViewZoomAtom
}) => {
  const [location] = useAtom(locationAtom)
  const streetViewLocation = useAtomValue(streetViewLocationAtom)
  const streetViewHeadingPitch = useAtomValue(streetViewHeadingPitchAtom)
  const streetViewZoom = useAtomValue(streetViewZoomAtom)

  const hidden = useAtomValue(hiddenAtom)
  if (hidden) {
    return null
  }
  return (
    <Pedestrian
      id={id}
      selected={selected}
      location={location}
      streetViewLocation={streetViewLocation ?? undefined}
      streetViewHeadingPitch={streetViewHeadingPitch ?? undefined}
      streetViewZoom={streetViewZoom ?? undefined}
    />
  )
}
