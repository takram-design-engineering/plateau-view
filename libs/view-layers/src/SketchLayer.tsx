import { useAtomValue } from 'jotai'
import { type FC } from 'react'

import { type LayerProps } from '@takram/plateau-layers'

import {
  createViewLayerModel,
  type ViewLayerModel,
  type ViewLayerModelParams
} from './createViewLayerModel'
import { SKETCH_LAYER } from './layerTypes'
import { type ConfigurableLayerModel } from './types'

export interface SketchLayerModelParams extends ViewLayerModelParams {}

export interface SketchLayerModel extends ViewLayerModel {}

export function createSketchLayer(
  params: SketchLayerModelParams
): ConfigurableLayerModel<SketchLayerModel> {
  return {
    ...createViewLayerModel({
      ...params,
      title: '作図'
    }),
    type: SKETCH_LAYER
  }
}

export const SketchLayer: FC<LayerProps<typeof SKETCH_LAYER>> = ({
  id,
  selected,
  titleAtom,
  hiddenAtom,
  boundingSphereAtom
}) => {
  const hidden = useAtomValue(hiddenAtom)
  if (hidden) {
    return null
  }
  return null
}
