import { PerspectiveFrustum } from '@cesium/engine'
import { styled } from '@mui/material'
import { useAtomValue, useSetAtom } from 'jotai'
import { Suspense, useRef, type FC } from 'react'
import invariant from 'tiny-invariant'

import { useCesium, usePreRender } from '@takram/plateau-cesium'
import { parse } from '@takram/plateau-cesium-helpers'
import {
  layersAtom,
  useFindLayer,
  type LayerModel
} from '@takram/plateau-layers'
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

const StreetViewFallback = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.divider
}))

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

export const Content: FC<{
  layer: LayerModel<typeof PEDESTRIAN_LAYER>
}> = ({ layer }) => {
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
  const streetViewFallbackRef = useRef<HTMLDivElement>(null)
  const camera = useCesium(({ camera }) => camera, { indirect: true })
  usePreRender(() => {
    if (camera == null) {
      return
    }
    const frustum = camera.frustum
    if (!(frustum instanceof PerspectiveFrustum)) {
      return
    }
    if (streetViewRef.current != null) {
      streetViewRef.current.style.aspectRatio = `${frustum.aspectRatio}`
    }
    if (streetViewFallbackRef.current != null) {
      streetViewFallbackRef.current.style.aspectRatio = `${frustum.aspectRatio}`
    }
  })

  invariant(
    process.env.NEXT_PUBLIC_GOOGLE_STREET_VIEW_API_KEY != null,
    'Missing environment variable: NEXT_PUBLIC_GOOGLE_STREET_VIEW_API_KEY'
  )
  return (
    <>
      <Suspense fallback={<StreetViewFallback ref={streetViewFallbackRef} />}>
        <StreetView
          key={layer.id}
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

  if (layer == null) {
    return null
  }
  return <Content layer={layer} />
}
