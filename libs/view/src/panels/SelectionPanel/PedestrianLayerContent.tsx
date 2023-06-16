import { PerspectiveFrustum } from '@cesium/engine'
import { useAtomValue, useSetAtom } from 'jotai'
import { Suspense, type FC, useRef } from 'react'
import invariant from 'tiny-invariant'

import { useCesium, usePreRender } from '@takram/plateau-cesium'
import { parse } from '@takram/plateau-cesium-helpers'
import { layersAtom, useFindLayer } from '@takram/plateau-layers'
import {
  StreetView,
  useStreetViewState,
  type PEDESTRIAN_OBJECT
} from '@takram/plateau-pedestrian'
import {
  InspectorItem,
  ParameterList,
  SwitchParameterItem
} from '@takram/plateau-ui-components'
import { PEDESTRIAN_LAYER } from '@takram/plateau-view-layers'

import {
  type LAYER_SELECTION,
  type SCREEN_SPACE_SELECTION,
  type SelectionGroup
} from '../../states/selection'

export interface PedestrianLayerContentProps {
  values: (SelectionGroup &
    (
      | {
          type: typeof LAYER_SELECTION
          subtype: typeof PEDESTRIAN_LAYER
        }
      | {
          type: typeof SCREEN_SPACE_SELECTION
          subtype: typeof PEDESTRIAN_OBJECT
        }
    ))['values']
}

export const PedestrianLayerContent: FC<PedestrianLayerContentProps> = ({
  values
}) => {
  const layers = useAtomValue(layersAtom)
  const findLayer = useFindLayer()
  // TODO: Support multiple layers
  const layer =
    typeof values[0] === 'string'
      ? findLayer(layers, {
          type: PEDESTRIAN_LAYER,
          id: parse(values[0]).key
        })
      : values[0]
  invariant(layer != null)

  const { synchronizeAtom, locationAtom, headingPitchAtom, zoomAtom } =
    useStreetViewState({
      synchronizeAtom: layer.synchronizeStreetViewAtom,
      locationAtom: layer.streetViewLocationAtom,
      headingPitchAtom: layer.streetViewHeadingPitchAtom,
      zoomAtom: layer.streetViewZoomAtom
    })

  const location = useAtomValue(layer.locationAtom)
  const setLocation = useSetAtom(locationAtom)
  const setHeadingPitch = useSetAtom(headingPitchAtom)
  const setZoom = useSetAtom(zoomAtom)

  const streetViewRef = useRef<HTMLDivElement>(null)
  const camera = useCesium(({ camera }) => camera, { indirect: true })
  usePreRender(() => {
    if (streetViewRef.current == null || camera == null) {
      return
    }
    const frustum = camera.frustum
    if (frustum instanceof PerspectiveFrustum) {
      streetViewRef.current.style.aspectRatio = `${frustum.aspectRatio}`
    }
  })

  invariant(
    process.env.NEXT_PUBLIC_GOOGLE_STREET_VIEW_API_KEY != null,
    'Missing environment variable: NEXT_PUBLIC_GOOGLE_STREET_VIEW_API_KEY'
  )
  return (
    <>
      <Suspense>
        <StreetView
          ref={streetViewRef}
          apiKey={process.env.NEXT_PUBLIC_GOOGLE_STREET_VIEW_API_KEY}
          location={location}
          onLocationChange={setLocation}
          onHeadingPitchChange={setHeadingPitch}
          onZoomChange={setZoom}
        />
      </Suspense>
      <InspectorItem>
        <ParameterList>
          <SwitchParameterItem
            label='カメラを歩行者視点と同期'
            atom={synchronizeAtom}
          />
        </ParameterList>
      </InspectorItem>
    </>
  )
}
