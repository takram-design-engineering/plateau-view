import { styled } from '@mui/material'
import { atom, useAtomValue } from 'jotai'
import { forwardRef } from 'react'

import {
  Canvas as CesiumCanvas,
  ShadowMap,
  type CanvasProps as CesiumCanvasProps,
  type ShadowMapProps
} from '@takram/plateau-cesium'
import {
  AmbientOcclusion,
  type AmbientOcclusionProps
} from '@takram/plateau-cesium-hbao'
import { withDeferredProps } from '@takram/plateau-react-helpers'

import {
  showShadowMapCascadeColorsAtom,
  showShadowMapDepthAtom
} from '../states/app'
import {
  ambientOcclusionAccurateNormalReconstructionAtom,
  ambientOcclusionBiasAtom,
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
import { SceneCoordinator } from './SceneCoordinator'

const Root = withDeferredProps(
  ['useBrowserRecommendedResolution'],
  styled(CesiumCanvas)({
    position: 'absolute',
    inset: 0,
    zIndex: -1 // Below any UI
  })
)

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
    bias: get(ambientOcclusionBiasAtom),
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
  ({ children, ...props }, forwardedRef) => {
    const nativeResolutionEnabled = useAtomValue(nativeResolutionEnabledAtom)
    const explicitRenderingEnabled = useAtomValue(explicitRenderingEnabledAtom)
    const antialiasType = useAtomValue(antialiasTypeAtom)
    const shadowMapProps = useAtomValue(shadowMapPropsAtom)
    const ambientOcclusionProps = useAtomValue(ambientOcclusionPropsAtom)
    const showShadowMapDepth = useAtomValue(showShadowMapDepthAtom)
    const showShadowMapCascadeColors = useAtomValue(
      showShadowMapCascadeColorsAtom
    )

    return (
      <Root
        ref={forwardedRef}
        msaaSamples={msaaSamples[antialiasType] ?? 0}
        useBrowserRecommendedResolution={!nativeResolutionEnabled}
        requestRenderMode={explicitRenderingEnabled}
        shouldAnimate
        maximumRenderTimeChange={1}
        {...props}
      >
        <ShadowMap
          {...shadowMapProps}
          maximumDistance={10000}
          debugShowDepth={showShadowMapDepth}
          debugShowCascadeColors={showShadowMapCascadeColors}
        />
        <AmbientOcclusion {...ambientOcclusionProps} />
        <SceneCoordinator />
        {children}
      </Root>
    )
  }
)
