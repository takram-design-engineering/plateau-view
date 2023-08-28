import { atom, useAtomValue, useSetAtom } from 'jotai'
import { nanoid } from 'nanoid'
import { useCallback, type FC } from 'react'
import invariant from 'tiny-invariant'

import {
  layersAtom,
  layerSelectionAtom,
  useAddLayer,
  type LayerModel
} from '@takram/plateau-layers'
import {
  SketchTool as SketchToolComponent,
  type SketchFeature
} from '@takram/plateau-sketch'
import { createViewLayer, SKETCH_LAYER } from '@takram/plateau-view-layers'

import {
  modalToolAtom,
  momentaryToolAtom,
  sketchTypeAtom
} from '../states/tool'

const selectedSketchLayerAtom = atom<LayerModel<typeof SKETCH_LAYER> | null>(
  get => {
    const selection = get(layerSelectionAtom)
    const layers = get(layersAtom)
    if (selection.length !== 1) {
      return null
    }
    const layer = layers.find(layer => layer.id === selection[0])
    invariant(layer != null)
    return layer.type === SKETCH_LAYER
      ? (layer as LayerModel<typeof SKETCH_LAYER>)
      : null
  }
)

const addFeatureAtom = atom(null, (get, set, value: SketchFeature) => {
  const layer = get(selectedSketchLayerAtom)
  if (layer == null) {
    return
  }
  set(layer.featureAtomsAtom, {
    type: 'insert',
    value
  })
})

const Wrapped: FC = () => {
  const layer = useAtomValue(selectedSketchLayerAtom)
  const addFeature = useSetAtom(addFeatureAtom)

  const addLayer = useAddLayer()
  const handleCreate = useCallback(
    (feature: SketchFeature) => {
      if (layer != null) {
        addFeature(feature)
      } else {
        const id = nanoid()
        const layer = createViewLayer({
          id,
          type: SKETCH_LAYER,
          features: [feature]
        })
        addLayer(layer)
      }
    },
    [layer, addFeature, addLayer]
  )

  const momentaryTool = useAtomValue(momentaryToolAtom)
  const sketchType = useAtomValue(sketchTypeAtom)
  return (
    <SketchToolComponent
      key={sketchType}
      type={sketchType}
      disableInteraction={
        momentaryTool != null && momentaryTool?.type !== 'sketch'
      }
      onCreate={handleCreate}
    />
  )
}

export const SketchTool: FC = () => {
  const tool = useAtomValue(modalToolAtom)
  if (tool?.type !== 'sketch') {
    return null
  }
  return <Wrapped />
}
