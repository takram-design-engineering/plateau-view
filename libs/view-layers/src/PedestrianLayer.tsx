import { atom, useAtomValue, type PrimitiveAtom } from 'jotai'
import { type FC } from 'react'
import { type SetOptional } from 'type-fest'

import { type LayerProps } from '@takram/plateau-layers'
import { Pedestrian } from '@takram/plateau-pedestrian'

import {
  createViewLayerBase,
  type ViewLayerModel,
  type ViewLayerModelParams
} from './createViewLayerBase'
import { PEDESTRIAN_LAYER } from './layerTypes'

export interface Location {
  longitude: number
  latitude: number
  height?: number
}

export interface PedestrianLayerModelParams
  extends ViewLayerModelParams,
    Location {}

export interface PedestrianLayerModel extends ViewLayerModel {
  locationAtom: PrimitiveAtom<Location>
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
      height: params.height
    })
  }
}

export const PedestrianLayer: FC<LayerProps<typeof PEDESTRIAN_LAYER>> = ({
  id,
  hiddenAtom,
  boundingSphereAtom,
  locationAtom
}) => {
  const { longitude, latitude } = useAtomValue(locationAtom)

  const hidden = useAtomValue(hiddenAtom)
  if (hidden) {
    return null
  }
  return <Pedestrian id={id} longitude={longitude} latitude={latitude} />
}
