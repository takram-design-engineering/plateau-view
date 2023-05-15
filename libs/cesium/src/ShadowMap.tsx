import { type ShadowMap as CesiumShadowMap } from '@cesium/engine'
import { type Primitive } from 'type-fest'

import { assignPropertyProps, withDeferredProps } from '@plateau/react-helpers'

import { useCesium } from './useCesium'

export interface ShadowMapBias {
  polygonOffsetFactor: number
  polygonOffsetUnits: number
  normalOffsetScale: number
  normalShading: boolean
  normalShadingSmooth: number
  depthBias: number
}

const defaultTerrainBias: ShadowMapBias = {
  polygonOffsetFactor: 1.1,
  polygonOffsetUnits: 4.0,
  normalOffsetScale: 0.5,
  normalShading: true,
  normalShadingSmooth: 0.3,
  depthBias: 0.0001
}

const defaultPrimitiveBias: ShadowMapBias = {
  polygonOffsetFactor: 1.1,
  polygonOffsetUnits: 4.0,
  normalOffsetScale: 0.1 * 100,
  normalShading: true,
  normalShadingSmooth: 0.05,
  depthBias: 0.00002 * 10
}

const defaultPointBias: ShadowMapBias = {
  polygonOffsetFactor: 1.1,
  polygonOffsetUnits: 4.0,
  normalOffsetScale: 0.0,
  normalShading: true,
  normalShadingSmooth: 0.1,
  depthBias: 0.0005
}

type ShadowMapOptions = Omit<
  {
    [K in keyof CesiumShadowMap]: CesiumShadowMap[K] extends Primitive
      ? CesiumShadowMap[K]
      : never
  },
  'darkness' // Darkness should be adjusted per environment.
>

const defaultShadowMapOptions: ShadowMapOptions = {
  enabled: true,
  size: 2048,
  softShadows: true,
  normalOffset: true,
  fadingEnabled: true,
  maximumDistance: 5000
}

export interface ShadowMapProps extends Partial<ShadowMapOptions> {
  terrainBias?: Partial<ShadowMapBias>
  primitiveBias?: Partial<ShadowMapBias>
  pointBias?: Partial<ShadowMapBias>
}

export const ShadowMap = withDeferredProps(
  ['enabled'],
  ({
    terrainBias = {},
    primitiveBias = {},
    pointBias = {},
    ...props
  }: ShadowMapProps) => {
    const scene = useCesium(({ scene }) => scene)
    // Private API
    const shadowMap = scene.shadowMap as CesiumShadowMap & {
      _terrainBias: ShadowMapBias
      _pointBias: ShadowMapBias
      _primitiveBias: ShadowMapBias
    }
    assignPropertyProps(shadowMap, props, defaultShadowMapOptions)

    // Private API
    assignPropertyProps(shadowMap._terrainBias, terrainBias, defaultTerrainBias)
    assignPropertyProps(shadowMap._pointBias, pointBias, defaultPointBias)
    assignPropertyProps(
      shadowMap._primitiveBias,
      primitiveBias,
      defaultPrimitiveBias
    )

    scene.requestRender()

    return null
  }
)
