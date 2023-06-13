import { Divider, styled } from '@mui/material'
import { useAtom, useSetAtom } from 'jotai'
import { Suspense, useCallback, type FC } from 'react'
import invariant from 'tiny-invariant'

import {
  StreetView,
  type HeadingPitch,
  type Location
} from '@takram/plateau-pedestrian'
import {
  Inspector,
  InspectorHeader,
  InspectorItem,
  PedestrianIcon
} from '@takram/plateau-ui-components'
import { type PEDESTRIAN_LAYER } from '@takram/plateau-view-layers'

import {
  type LAYER_SELECTION,
  type SelectionGroup
} from '../../states/selection'
import { LayerActions } from './LayerActions'

const StyledStreetView = styled(StreetView)({
  aspectRatio: '3 / 2'
})

export interface PedestrianLayerContentProps {
  values: (SelectionGroup & {
    type: typeof LAYER_SELECTION
    subtype: typeof PEDESTRIAN_LAYER
  })['values']
}

export const PedestrianLayerContent: FC<PedestrianLayerContentProps> = ({
  values
}) => {
  const [layer] = values
  const [location] = useAtom(layer.locationAtom)
  const setStreetViewLocation = useSetAtom(layer.streetViewLocationAtom)
  const setStreetViewHeadingPitch = useSetAtom(layer.streetViewHeadingPitchAtom)
  const setStreetViewZoom = useSetAtom(layer.streetViewZoomAtom)

  const handleLocationChange = useCallback(
    (location?: Location) => {
      setStreetViewLocation(location ?? null)
    },
    [setStreetViewLocation]
  )
  const handleHeadingPitchChange = useCallback(
    (headingPitch?: HeadingPitch) => {
      setStreetViewHeadingPitch(headingPitch ?? null)
    },
    [setStreetViewHeadingPitch]
  )
  const handleZoomChange = useCallback(
    (zoom?: number) => {
      setStreetViewZoom(zoom ?? null)
    },
    [setStreetViewZoom]
  )

  if (values.length > 1) {
    return (
      <Inspector>
        <InspectorHeader
          // TODO: Change name and icon according to the feature type.
          title={`${values.length}個の歩行者視点`}
          iconComponent={PedestrianIcon}
        />
        <Divider light />
      </Inspector>
    )
  }

  invariant(
    process.env.NEXT_PUBLIC_GOOGLE_MAP_TILES_API_KEY != null,
    'Missing environment variable: NEXT_PUBLIC_GOOGLE_MAP_TILES_API_KEY'
  )
  return (
    <Inspector sx={{ width: 480 }}>
      <InspectorHeader title='歩行者視点' iconComponent={PedestrianIcon} />
      <Divider light />
      <LayerActions values={values} />
      <Divider light />
      <InspectorItem disablePadding>
        <Suspense>
          <StyledStreetView
            apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_TILES_API_KEY}
            location={location}
            onLocationChange={handleLocationChange}
            onHeadingPitchChange={handleHeadingPitchChange}
            onZoomChange={handleZoomChange}
          />
        </Suspense>
      </InspectorItem>
    </Inspector>
  )
}
