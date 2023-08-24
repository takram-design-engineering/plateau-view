import { atom, useAtomValue, type PrimitiveAtom } from 'jotai'
import { splitAtom } from 'jotai/utils'
import { type FC } from 'react'

import { type LayerProps } from '@takram/plateau-layers'
import { Sketch, type SketchFeature } from '@takram/plateau-sketch'
import { type SplitAtom } from '@takram/plateau-type-helpers'

import {
  createViewLayerModel,
  type ViewLayerModel,
  type ViewLayerModelParams
} from './createViewLayerModel'
import { SKETCH_LAYER } from './layerTypes'
import { type ConfigurableLayerModel } from './types'

let nextLayerIndex = 1

export interface SketchLayerModelParams extends ViewLayerModelParams {
  features?: readonly SketchFeature[]
}

export interface SketchLayerModel extends ViewLayerModel {
  featuresAtom: PrimitiveAtom<SketchFeature[]>
  featureAtomsAtom: SplitAtom<SketchFeature>
}

export function createSketchLayer(
  params: SketchLayerModelParams
): ConfigurableLayerModel<SketchLayerModel> {
  const featuresAtom = atom<SketchFeature[]>([...(params.features ?? [])])
  return {
    ...createViewLayerModel({
      ...params,
      // TODO: Avoid side-effect
      title: `作図${nextLayerIndex++}`
    }),
    type: SKETCH_LAYER,
    featuresAtom,
    featureAtomsAtom: splitAtom(featuresAtom)
  }
}

export const SketchLayer: FC<LayerProps<typeof SKETCH_LAYER>> = ({
  id,
  selected,
  titleAtom,
  hiddenAtom,
  boundingSphereAtom,
  featuresAtom,
  featureAtomsAtom
}) => {
  const hidden = useAtomValue(hiddenAtom)
  if (hidden) {
    return null
  }
  return (
    <Sketch featuresAtom={featuresAtom} featureAtomsAtom={featureAtomsAtom} />
  )
}
