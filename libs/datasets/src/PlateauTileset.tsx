import {
  Cesium3DTileFeature,
  Cesium3DTileset,
  ShadowMode,
  type Cesium3DTile,
  type Cesium3DTileStyle
} from '@cesium/engine'
import { useAtomValue } from 'jotai'
import { difference } from 'lodash'
import { forwardRef, useEffect, useRef, type ForwardedRef } from 'react'

import { useAsyncInstance, useCesium } from '@takram/plateau-cesium'
import { forEachTileFeature } from '@takram/plateau-cesium-helpers'
import {
  assignForwardedRef,
  useConstant,
  withDeferredProps,
  withEphemerality
} from '@takram/plateau-react-helpers'
import {
  screenSpaceSelectionAtom,
  useScreenSpaceSelectionResponder,
  type ScreenSpaceSelectionEntry
} from '@takram/plateau-screen-space-selection'

import { computePlateauBoundingSphere } from './computePlateauBoundingSphere'
import { getGMLId } from './getGMLId'
import { LambertDiffuseShader } from './LambertDiffuseShader'
import {
  showTilesetBoundingVolumeAtom,
  showTilesetWireframeAtom
} from './states'
import { TileFeatureIndex } from './TileFeatureIndex'
import { type TilesetPrimitiveConstructorOptions } from './types'

export const PLATEAU_TILE_FEATURE = 'PLATEAU_TILE_FEATURE'

declare module '@takram/plateau-screen-space-selection' {
  interface ScreenSpaceSelectionOverrides {
    [PLATEAU_TILE_FEATURE]: {
      key: string
      featureIndex: TileFeatureIndex
    }
  }
}

function initTile(
  tile: Cesium3DTile,
  states: {
    hiddenFeatures?: readonly string[]
    selection?: readonly ScreenSpaceSelectionEntry[]
  }
): void {
  forEachTileFeature(tile, feature => {
    const id = getGMLId(feature)
    if (id == null) {
      return
    }
    if (states.hiddenFeatures?.includes(id) === true) {
      feature.show = false
    }
    if (
      states.selection?.some(
        ({ type, value }) => type === PLATEAU_TILE_FEATURE && value.key === id
      ) === true
    ) {
      feature.setProperty('__selected', true)
    }
  })
}

function useSelectionResponder({
  tileset,
  featureIndex
}: {
  tileset?: Cesium3DTileset
  featureIndex: TileFeatureIndex
}): void {
  useScreenSpaceSelectionResponder({
    type: PLATEAU_TILE_FEATURE,
    convertToSelection: object => {
      if (
        !(object instanceof Cesium3DTileFeature) ||
        object.tileset !== tileset
      ) {
        return
      }
      const id = getGMLId(object)
      return id != null
        ? {
            type: PLATEAU_TILE_FEATURE,
            value: {
              key: id,
              featureIndex
            }
          }
        : undefined
    },
    shouldRespondToSelection: (
      value
    ): value is ScreenSpaceSelectionEntry<typeof PLATEAU_TILE_FEATURE> => {
      return (
        value.type === PLATEAU_TILE_FEATURE && featureIndex.has(value.value.key)
      )
    },
    onSelect: value => {
      const features = featureIndex.find(value.value.key)
      if (features == null) {
        return
      }
      features.forEach(feature => {
        feature.setProperty('__selected', true)
      })
    },
    onDeselect: value => {
      const features = featureIndex.find(value.value.key)
      if (features == null) {
        return
      }
      features.forEach(feature => {
        feature.setProperty('__selected', false)
      })
    },
    computeBoundingSphere: (value, result) => {
      const features = featureIndex.find(value.value.key)
      if (features == null) {
        return
      }
      return computePlateauBoundingSphere(features, result)
    }
  })
}

function useHiddenFeatures({
  featureIndex,
  hiddenFeatures
}: {
  featureIndex: TileFeatureIndex
  hiddenFeatures?: readonly string[]
}): void {
  const scene = useCesium(({ scene }) => scene)
  const prevHiddenFeaturesRef = useRef(hiddenFeatures)
  useEffect(() => {
    const prevValue = prevHiddenFeaturesRef.current ?? []
    const nextValue = hiddenFeatures ?? []
    prevHiddenFeaturesRef.current = hiddenFeatures
    const keysToHide = difference(nextValue, prevValue)
    const keysToShow = difference(prevValue, nextValue)
    if (keysToShow.length > 0) {
      keysToShow.forEach(key => {
        featureIndex.find(key)?.forEach(feature => {
          feature.show = true
        })
      })
    }
    if (keysToHide.length > 0) {
      keysToHide.forEach(key => {
        featureIndex.find(key)?.forEach(feature => {
          feature.show = false
        })
      })
    }
    scene.requestRender()
  }, [hiddenFeatures, featureIndex, scene])
}

interface PlateauTilesetContentProps
  extends TilesetPrimitiveConstructorOptions {
  featureIndexRef?: ForwardedRef<TileFeatureIndex>
  url: string
  style?: Cesium3DTileStyle
  disableShadow?: boolean
  hiddenFeatures?: readonly string[]
  showWireframe?: boolean
  showBoundingVolume?: boolean
}

const PlateauTilesetContent = withEphemerality(
  () => useCesium(({ scene }) => scene).primitives,
  ['url'],
  forwardRef<Cesium3DTileset, PlateauTilesetContentProps>(
    (
      {
        featureIndexRef,
        url,
        style,
        disableShadow = false,
        hiddenFeatures,
        showWireframe = false,
        showBoundingVolume = false,
        ...props
      },
      forwardedRef
    ) => {
      // Assume that component is ephemeral.
      const featureIndex = useConstant(() => new TileFeatureIndex())
      useEffect(
        () => assignForwardedRef(featureIndexRef, featureIndex),
        [featureIndexRef, featureIndex]
      )

      const selection = useAtomValue(screenSpaceSelectionAtom)

      const stateRef = useRef({
        hiddenFeatures,
        selection
      })
      Object.assign(stateRef.current, {
        hiddenFeatures,
        selection
      })

      const scene = useCesium(({ scene }) => scene)
      const tileset = useAsyncInstance({
        owner: scene.primitives,
        keys: [url, scene],
        create: async () =>
          await Cesium3DTileset.fromUrl(url, {
            // @ts-expect-error missing type
            customShader: LambertDiffuseShader,
            shadows:
              disableShadow || showWireframe
                ? ShadowMode.DISABLED
                : ShadowMode.ENABLED,
            debugWireframe: showWireframe,
            debugShowBoundingVolume: showBoundingVolume
          }),
        transferOwnership: (tileset, primitives) => {
          const removeListeners = [
            tileset.tileLoad.addEventListener((tile: Cesium3DTile) => {
              featureIndex.addTile(tile, getGMLId)
              initTile(tile, stateRef.current)
            })
          ]
          // TODO: Make sure it's not necessary to observe tileUnload events.
          primitives.add(tileset)
          return () => {
            // No need to clean up gmlIndex because component is ephemeral.
            removeListeners.forEach(removeListener => {
              removeListener()
            })
            primitives.remove(tileset)
          }
        }
      })

      if (tileset != null) {
        tileset.shadows =
          disableShadow || showWireframe
            ? ShadowMode.DISABLED
            : ShadowMode.ENABLED
        tileset.debugWireframe = showWireframe
        tileset.debugShowBoundingVolume = showBoundingVolume
        Object.assign(tileset, props)
        scene.requestRender()
      }

      useEffect(
        () => assignForwardedRef(forwardedRef, tileset ?? null),
        [forwardedRef, tileset]
      )

      // Assignment of style is not trivial.
      useEffect(() => {
        if (tileset != null) {
          tileset.style = style
        }
      }, [style, tileset])

      useHiddenFeatures({
        featureIndex,
        hiddenFeatures
      })
      useSelectionResponder({
        tileset,
        featureIndex
      })

      return null
    }
  )
)

const DeferredPlateauTilesetContent = withDeferredProps(
  ['showWireframe', 'showBoundingVolume'],
  PlateauTilesetContent
)

export interface PlateauTilesetProps
  extends Omit<PlateauTilesetContentProps, 'showBoundingVolume'> {}

export const PlateauTileset = forwardRef<Cesium3DTileset, PlateauTilesetProps>(
  ({ showWireframe: showWireframeProp = false, ...props }, forwardedRef) => {
    const showWireframe = useAtomValue(showTilesetWireframeAtom)
    const showBoundingVolume = useAtomValue(showTilesetBoundingVolumeAtom)
    return (
      <DeferredPlateauTilesetContent
        ref={forwardedRef}
        {...props}
        showWireframe={showWireframeProp || showWireframe}
        showBoundingVolume={showBoundingVolume}
      />
    )
  }
)
