import { BoundingSphere, Cartesian3, Cartographic } from '@cesium/engine'
import {
  atom,
  useAtom,
  useAtomValue,
  useSetAtom,
  type PrimitiveAtom,
  type SetStateAction
} from 'jotai'
import { useCallback, useEffect, useMemo, type FC } from 'react'
import invariant from 'tiny-invariant'

import { useCesium } from '@takram/plateau-cesium'
import { match } from '@takram/plateau-cesium-helpers'
import { useAddress } from '@takram/plateau-geocoder'
import { type LayerProps } from '@takram/plateau-layers'
import {
  Pedestrian,
  PEDESTRIAN_OBJECT,
  type HeadingPitch,
  type Location
} from '@takram/plateau-pedestrian'
import { screenSpaceSelectionAtom } from '@takram/plateau-screen-space-selection'

import {
  createViewLayerModel,
  type ViewLayerModel,
  type ViewLayerModelParams
} from './createViewLayerModel'
import { PEDESTRIAN_LAYER } from './layerTypes'
import { type ConfigurableLayerModel } from './types'

let nextLayerIndex = 1

export interface PedestrianLayerModelParams extends ViewLayerModelParams {
  location: Location
  headingPitchAtom?: HeadingPitch
  zoomAtom?: number
}

export interface PedestrianLayerModel extends ViewLayerModel {
  panoAtom: PrimitiveAtom<string | null>
  locationAtom: PrimitiveAtom<Location>
  headingPitchAtom: PrimitiveAtom<HeadingPitch | null>
  zoomAtom: PrimitiveAtom<number | null>
  synchronizedAtom: PrimitiveAtom<boolean>
  addressAtom: PrimitiveAtom<string | null>
}

export function createPedestrianLayer(
  params: PedestrianLayerModelParams
): ConfigurableLayerModel<PedestrianLayerModel> {
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
    ...createViewLayerModel({
      ...params,
      // TODO: Avoid side-effect
      title: `歩行者視点${nextLayerIndex++}`
    }),
    type: PEDESTRIAN_LAYER,
    panoAtom: atom<string | null>(null),
    locationAtom,
    headingPitchAtom,
    zoomAtom: atom<number | null>(params.zoomAtom ?? null),
    synchronizedAtom: atom(false),
    addressAtom: atom<string | null>(null)
  }
}

const cartographicScratch = new Cartographic()

export const PedestrianLayer: FC<LayerProps<typeof PEDESTRIAN_LAYER>> = ({
  id,
  selected,
  titleAtom,
  hiddenAtom,
  boundingSphereAtom,
  panoAtom,
  locationAtom,
  headingPitchAtom,
  zoomAtom,
  synchronizedAtom,
  addressAtom
}) => {
  const [pano, setPano] = useAtom(panoAtom)
  const [location, setLocation] = useAtom(locationAtom)
  const headingPitch = useAtomValue(headingPitchAtom)
  const zoom = useAtomValue(zoomAtom)
  const synchronized = useAtomValue(synchronizedAtom)

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
      setPano(null)
      setLocation(location)
    },
    [setPano, setLocation]
  )

  const setBoundingSphere = useSetAtom(boundingSphereAtom)
  const scene = useCesium(({ scene }) => scene, { indirect: true })
  useEffect(() => {
    const boundingSphere = new BoundingSphere()
    const groundHeight =
      scene?.globe.getHeight(
        Cartographic.fromDegrees(
          location.longitude,
          location.latitude,
          undefined,
          cartographicScratch
        )
      ) ?? 0
    Cartesian3.fromDegrees(
      location.longitude,
      location.latitude,
      groundHeight + (location.height ?? 0),
      scene?.globe.ellipsoid,
      boundingSphere.center
    )
    boundingSphere.radius = 200 // Arbitrary size
    setBoundingSphere(boundingSphere)
  }, [location, setBoundingSphere, scene])

  const setTitle = useSetAtom(titleAtom)
  const setAddress = useSetAtom(addressAtom)
  const address = useAddress({
    longitude: location.longitude,
    latitude: location.latitude
  })
  useEffect(() => {
    setTitle(title => {
      const primary = typeof title === 'string' ? title : title?.primary
      invariant(primary != null)
      return {
        primary,
        secondary: address?.address
      }
    })
    setAddress(address?.address ?? null)
  }, [setTitle, setAddress, address])

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
      hideFrustum={pano == null || synchronized}
      onChange={handleChange}
    />
  )
}
