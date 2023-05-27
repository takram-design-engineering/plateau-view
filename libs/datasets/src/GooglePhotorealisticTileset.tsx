import { Cesium3DTileset, ShadowMode } from '@cesium/engine'
import { useAtomValue } from 'jotai'
import { type FC } from 'react'

import { useAsyncInstance, useCesium } from '@takram/plateau-cesium'
import {
  withDeferredProps,
  withEphemerality
} from '@takram/plateau-react-helpers'

import { LambertDiffuseShader } from './LambertDiffuseShader'
import {
  showBoundingVolumeAtom,
  showTexturesAtom,
  showWireframeAtom
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
    const showTextures = useAtomValue(showTexturesAtom)

    const scene = useCesium(({ scene }) => scene)
    const tileset = useAsyncInstance({
      owner: scene.primitives,
      keys: [apiKey, scene],
      create: async () =>
        await Cesium3DTileset.fromUrl(
          `https://tile.googleapis.com/v1/3dtiles/root.json?key=${apiKey}`,
          {
            // @ts-expect-error missing type
            customShader: !showTextures ? LambertDiffuseShader : undefined,
            debugWireframe: showWireframe,
            debugShowBoundingVolume: showBoundingVolume,
            shadows: showWireframe ? ShadowMode.DISABLED : ShadowMode.ENABLED
          }
        ),
      transferOwnership: (tileset, primitives) => {
        primitives.add(tileset)
        return () => {
          primitives.remove(tileset)
        }
      }
    })

    if (tileset != null) {
      tileset.customShader = !showTextures ? LambertDiffuseShader : undefined
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
  const showWireframe = useAtomValue(showWireframeAtom)
  const showBoundingVolume = useAtomValue(showBoundingVolumeAtom)

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
