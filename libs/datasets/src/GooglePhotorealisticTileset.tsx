import { createGooglePhotorealistic3DTileset, ShadowMode } from '@cesium/engine'
import { useAtomValue } from 'jotai'
import { type FC } from 'react'

import { useAsyncInstance, useCesium } from '@takram/plateau-cesium'
import {
  withDeferredProps,
  withEphemerality
} from '@takram/plateau-react-helpers'

import { LambertDiffuseShader } from './LambertDiffuseShader'
import {
  showTilesetBoundingVolumeAtom,
  showTilesetTextureAtom,
  showTilesetWireframeAtom
} from './states'
import { type TilesetPrimitiveConstructorOptions } from './types'

interface GooglePhotorealisticTilesetContentProps
  extends TilesetPrimitiveConstructorOptions {
  apiKey?: string
  showWireframe?: boolean
  showBoundingVolume?: boolean
}

const GooglePhotorealisticTilesetContent = withEphemerality(
  () => useCesium(({ scene }) => scene).primitives,
  ['apiKey'],
  ({
    apiKey,
    showWireframe = false,
    showBoundingVolume = false,
    ...props
  }: GooglePhotorealisticTilesetContentProps) => {
    const showTexture = useAtomValue(showTilesetTextureAtom)

    const scene = useCesium(({ scene }) => scene)
    const tileset = useAsyncInstance({
      owner: scene.primitives,
      keys: [apiKey, scene],
      create: async () =>
        await createGooglePhotorealistic3DTileset(apiKey, {
          // @ts-expect-error missing type
          customShader: !showTexture ? LambertDiffuseShader : undefined,
          debugWireframe: showWireframe,
          debugShowBoundingVolume: showBoundingVolume,
          shadows: showWireframe ? ShadowMode.DISABLED : ShadowMode.ENABLED
        }),
      transferOwnership: (tileset, primitives) => {
        primitives.add(tileset)
        return () => {
          primitives.remove(tileset)
        }
      }
    })

    if (tileset != null) {
      tileset.customShader = !showTexture ? LambertDiffuseShader : undefined
      tileset.debugWireframe = showWireframe
      tileset.debugShowBoundingVolume = showBoundingVolume
      Object.assign(tileset, props)
    }

    return null
  }
)

const DeferredGooglePhotorealisticTilesetContent = withDeferredProps(
  ['showWireframe', 'showBoundingVolume'],
  GooglePhotorealisticTilesetContent
)

export interface GooglePhotorealisticTilesetProps
  extends Omit<
    GooglePhotorealisticTilesetContentProps,
    'showWireframe' | 'showBoundingVolume'
  > {}

export const GooglePhotorealisticTileset: FC<
  GooglePhotorealisticTilesetProps
> = props => {
  const showWireframe = useAtomValue(showTilesetWireframeAtom)
  const showBoundingVolume = useAtomValue(showTilesetBoundingVolumeAtom)

  if (props.apiKey == null) {
    return null
  }
  return (
    <DeferredGooglePhotorealisticTilesetContent
      {...props}
      showWireframe={showWireframe}
      showBoundingVolume={showBoundingVolume}
    />
  )
}
