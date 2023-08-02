import { PerspectiveFrustum } from '@cesium/engine'
import { alpha, Button, IconButton, List, styled, Tooltip } from '@mui/material'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Suspense, useCallback, useEffect, useRef, type FC } from 'react'
import invariant from 'tiny-invariant'

import { useCesium, usePreRender } from '@takram/plateau-cesium'
import { flyToBoundingSphere, parse } from '@takram/plateau-cesium-helpers'
import {
  layersAtom,
  layerSelectionAtom,
  removeLayerAtom,
  useFindLayer,
  type LayerModel
} from '@takram/plateau-layers'
import {
  StreetView,
  useSynchronizeStreetView,
  type HeadingPitch,
  type Location,
  type PEDESTRIAN_OBJECT
} from '@takram/plateau-pedestrian'
import { screenSpaceSelectionAtom } from '@takram/plateau-screen-space-selection'
import {
  AddressIcon,
  DarkThemeOverride,
  InspectorHeader,
  PedestrianIcon,
  TrashIcon,
  VisibilityOffIcon,
  VisibilityOnIcon
} from '@takram/plateau-ui-components'
import { PEDESTRIAN_LAYER } from '@takram/plateau-view-layers'

import {
  type LAYER_SELECTION,
  type SCREEN_SPACE_SELECTION,
  type SelectionGroup
} from '../../states/selection'

const StreetViewContainer = styled('div')(({ theme }) => ({
  position: 'relative',
  backgroundColor: theme.palette.divider
}))

const StyledStreetView = styled(StreetView)({
  width: '100%',
  height: '100%'
})

const StreetViewOverlay = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  left: '50%',
  zIndex: 1,
  transform: 'translateX(-50%)',
  pointerEvents: 'none',
  '& > *': {
    pointerEvents: 'auto'
  }
}))

const OverlayButton = styled(Button)(({ theme }) => ({
  ...theme.typography.body2,
  minHeight: theme.spacing(4),
  color: theme.palette.text.primary,
  backgroundColor: alpha(theme.palette.background.default, 0.5),
  fontWeight: theme.typography.button.fontWeight,
  backdropFilter: 'blur(32px)'
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
  const { locationAtom, headingPitchAtom, zoomAtom, synchronizedAtom } =
    useSynchronizeStreetView({
      locationAtom: layer.locationAtom,
      headingPitchAtom: layer.headingPitchAtom,
      zoomAtom: layer.zoomAtom,
      synchronizedAtom: layer.synchronizedAtom
    })

  const [pano, setPano] = useAtom(layer.panoAtom)
  const location = useAtomValue(layer.locationAtom)
  const headingPitch = useAtomValue(layer.headingPitchAtom)
  const zoom = useAtomValue(layer.zoomAtom)

  const setLocation = useSetAtom(locationAtom)
  const setHeadingPitch = useSetAtom(headingPitchAtom)
  const setZoom = useSetAtom(zoomAtom)
  const [synchronized, setSynchronized] = useAtom(synchronizedAtom)

  const handleLoad = useCallback(
    (
      pano: string,
      location: Location,
      headingPitch: HeadingPitch,
      zoom: number
    ) => {
      setPano(pano)
      setLocation(location)
      setHeadingPitch(headingPitch)
      setZoom(zoom)
    },
    [setPano, setLocation, setHeadingPitch, setZoom]
  )

  const handleLocationChange = useCallback(
    (pano: string, location: Location) => {
      setPano(pano)
      setLocation(location)
    },
    [setPano, setLocation]
  )

  const handleError = useCallback(() => {
    setPano(null)
  }, [setPano])

  const handleSynchronize = useCallback(() => {
    setSynchronized(true)
  }, [setSynchronized])

  useEffect(() => {
    return () => {
      setSynchronized(false)
    }
  }, [setSynchronized])

  const streetViewRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const camera = useCesium(({ camera }) => camera, { indirect: true })
  usePreRender(() => {
    if (camera == null) {
      return
    }
    const frustum = camera.frustum
    if (!(frustum instanceof PerspectiveFrustum)) {
      return
    }
    if (containerRef.current != null) {
      containerRef.current.style.aspectRatio = `${frustum.aspectRatio}`
    }
  })

  const title = useAtomValue(layer.titleAtom)

  const setLayerSelection = useSetAtom(layerSelectionAtom)
  const setScreenSpaceSelection = useSetAtom(screenSpaceSelectionAtom)
  const handleClose = useCallback(() => {
    setLayerSelection([])
    setScreenSpaceSelection([])
  }, [setLayerSelection, setScreenSpaceSelection])

  const [hidden, setHidden] = useAtom(layer.hiddenAtom)
  const handleToggleHidden = useCallback(() => {
    setHidden(value => !value)
  }, [setHidden])

  const boundingSphere = useAtomValue(layer.boundingSphereAtom)
  const scene = useCesium(({ scene }) => scene, { indirect: true })
  const handleMove = useCallback(() => {
    if (boundingSphere == null || scene == null) {
      return
    }
    void flyToBoundingSphere(scene, boundingSphere)
  }, [boundingSphere, scene])

  const remove = useSetAtom(removeLayerAtom)
  const handleRemove = useCallback(() => {
    remove(layer.id)
  }, [layer, remove])

  invariant(
    process.env.NEXT_PUBLIC_GOOGLE_STREET_VIEW_API_KEY != null,
    'Missing environment variable: NEXT_PUBLIC_GOOGLE_STREET_VIEW_API_KEY'
  )
  return (
    <List disablePadding>
      <InspectorHeader
        title={title ?? undefined}
        iconComponent={PedestrianIcon}
        actions={
          <>
            <Tooltip title={hidden ? '表示' : '隠す'}>
              <IconButton
                aria-label={hidden ? '表示' : '隠す'}
                onClick={handleToggleHidden}
              >
                {hidden ? <VisibilityOffIcon /> : <VisibilityOnIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title='移動'>
              <span>
                <IconButton
                  aria-label='移動'
                  disabled={boundingSphere == null}
                  onClick={handleMove}
                >
                  <AddressIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title='削除'>
              <IconButton aria-label='削除' onClick={handleRemove}>
                <TrashIcon />
              </IconButton>
            </Tooltip>
          </>
        }
        onClose={handleClose}
      />
      <StreetViewContainer ref={containerRef}>
        <Suspense>
          <StyledStreetView
            key={layer.id}
            ref={streetViewRef}
            apiKey={process.env.NEXT_PUBLIC_GOOGLE_STREET_VIEW_API_KEY}
            pano={pano ?? undefined}
            location={location}
            headingPitch={headingPitch ?? undefined}
            zoom={zoom ?? undefined}
            onLoad={handleLoad}
            onError={handleError}
            onLocationChange={handleLocationChange}
            onHeadingPitchChange={setHeadingPitch}
            onZoomChange={setZoom}
          />
          <StreetViewOverlay>
            <DarkThemeOverride>
              {!synchronized && (
                <OverlayButton variant='contained' onClick={handleSynchronize}>
                  カメラをここに移動
                </OverlayButton>
              )}
            </DarkThemeOverride>
          </StreetViewOverlay>
        </Suspense>
      </StreetViewContainer>
    </List>
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
