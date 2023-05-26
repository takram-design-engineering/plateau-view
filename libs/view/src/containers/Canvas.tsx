import { Globe } from '@cesium/engine'
import { styled } from '@mui/material'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { forwardRef, memo, useCallback, type FC } from 'react'
import { mergeRefs } from 'react-merge-refs'

import {
  Canvas as CesiumCanvas,
  ShadowMap,
  useCesium,
  type CanvasProps as CesiumCanvasProps,
  type ShadowMapProps
} from '@takram/plateau-cesium'
import {
  AmbientOcclusion,
  type AmbientOcclusionProps
} from '@takram/plateau-cesium-hbao'
import { JapanSeaLevelEllipsoid } from '@takram/plateau-datasets'
import { withDeferredProps } from '@takram/plateau-react-helpers'
import { isNotNullish } from '@takram/plateau-type-helpers'

import { cesiumAtom, readyAtom } from '../states/app'
import {
  ambientOcclusionAccurateNormalReconstructionAtom,
  ambientOcclusionBlackPointAtom,
  ambientOcclusionDenoiseAtom,
  ambientOcclusionDirectionsAtom,
  ambientOcclusionEnabledAtom,
  ambientOcclusionGammaAtom,
  ambientOcclusionIntensityAtom,
  ambientOcclusionMaxRadiusAtom,
  ambientOcclusionOutputTypeAtom,
  ambientOcclusionStepsAtom,
  ambientOcclusionTextureScaleAtom,
  ambientOcclusionWhitePointAtom,
  antialiasTypeAtom,
  explicitRenderingEnabledAtom,
  nativeResolutionEnabledAtom,
  shadowMapEnabledAtom,
  shadowMapSizeAtom,
  shadowMapSoftShadowsAtom,
  type AntialiasType
} from '../states/graphics'
import { showGlobeWireframeAtom } from '../states/performance'

declare module '@cesium/engine' {
  interface Globe {
    _surface: {
      tileProvider: {
        _debug: {
          wireframe: boolean
        }
      }
    }
  }
}

const Root = withDeferredProps(
  ['useBrowserRecommendedResolution'],
  styled(CesiumCanvas)({
    position: 'absolute',
    inset: 0,
    zIndex: -1 // Below any UI
  })
)

const Configure: FC = memo(() => {
  const scene = useCesium(({ scene }) => scene)

  // Increase the precision of the depth buffer which HBAO looks up to
  // reconstruct normals.
  scene.camera.frustum.near = 5

  const showGlobeWireframe = useAtomValue(showGlobeWireframeAtom)
  scene.globe._surface.tileProvider._debug.wireframe = showGlobeWireframe

  const antialiasType = useAtomValue(antialiasTypeAtom)
  scene.postProcessStages.fxaa.enabled = antialiasType === 'fxaa'

  scene.requestRender()
  return null
})

const shadowMapPropsAtom = atom(
  (get): ShadowMapProps => ({
    enabled: get(shadowMapEnabledAtom),
    size: get(shadowMapSizeAtom),
    softShadows: get(shadowMapSoftShadowsAtom)
  })
)

const ambientOcclusionPropsAtom = atom(
  (get): AmbientOcclusionProps => ({
    enabled: get(ambientOcclusionEnabledAtom),
    intensity: get(ambientOcclusionIntensityAtom),
    maxRadius: get(ambientOcclusionMaxRadiusAtom),
    directions: get(ambientOcclusionDirectionsAtom),
    steps: get(ambientOcclusionStepsAtom),
    blackPoint: get(ambientOcclusionBlackPointAtom),
    whitePoint: get(ambientOcclusionWhitePointAtom),
    gamma: get(ambientOcclusionGammaAtom),
    textureScale: get(ambientOcclusionTextureScaleAtom),
    denoise: get(ambientOcclusionDenoiseAtom),
    accurateNormalReconstruction: get(
      ambientOcclusionAccurateNormalReconstructionAtom
    ),
    outputType: get(ambientOcclusionOutputTypeAtom)
  })
)

const msaaSamples: Record<AntialiasType, number | undefined> = {
  none: 0,
  fxaa: 0,
  msaa2x: 2,
  msaa4x: 4,
  msaa8x: 8
}

export interface CanvasProps extends CesiumCanvasProps {}

export const Canvas = forwardRef<HTMLDivElement, CanvasProps>(
  ({ cesiumRef, children, ...props }, forwardedRef) => {
    const constructorOptions = useCallback(
      () => ({
        globe: new Globe(JapanSeaLevelEllipsoid)
      }),
      []
    )

    const setCesium = useSetAtom(cesiumAtom)
    const ready = useAtomValue(readyAtom)
    const nativeResolutionEnabled = useAtomValue(nativeResolutionEnabledAtom)
    const explicitRenderingEnabled = useAtomValue(explicitRenderingEnabledAtom)
    const antialiasType = useAtomValue(antialiasTypeAtom)
    const shadowMapProps = useAtomValue(shadowMapPropsAtom)
    const ambientOcclusionProps = useAtomValue(ambientOcclusionPropsAtom)

    return (
      <Root
        ref={forwardedRef}
        cesiumRef={mergeRefs([cesiumRef, setCesium].filter(isNotNullish))}
        constructorOptions={constructorOptions}
        msaaSamples={msaaSamples[antialiasType] ?? 0}
        useBrowserRecommendedResolution={!nativeResolutionEnabled}
        resolutionScale={ready ? undefined : 0.1}
        requestRenderMode={explicitRenderingEnabled}
        shouldAnimate
        maximumRenderTimeChange={1}
        {...props}
      >
        <Configure />
        <ShadowMap {...shadowMapProps} maximumDistance={10000} />
        <AmbientOcclusion {...ambientOcclusionProps} />
        {children}
      </Root>
    )
  }
)
