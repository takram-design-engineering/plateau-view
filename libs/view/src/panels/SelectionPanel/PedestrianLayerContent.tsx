import { styled } from '@mui/material'
import { useAtomValue, useSetAtom } from 'jotai'
import { Suspense, type FC } from 'react'
import invariant from 'tiny-invariant'

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

const StyledStreetView = styled(StreetView)({
  aspectRatio: '3 / 2'
})

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

  invariant(
    process.env.NEXT_PUBLIC_GOOGLE_STREET_VIEW_API_KEY != null,
    'Missing environment variable: NEXT_PUBLIC_GOOGLE_STREET_VIEW_API_KEY'
  )
  return (
    <>
      <Suspense>
        <StyledStreetView
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
