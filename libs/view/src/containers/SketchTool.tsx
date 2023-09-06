import { atom, useAtomValue, useSetAtom } from 'jotai'
import { nanoid } from 'nanoid'
import { useCallback, type FC } from 'react'

import { compose } from '@takram/plateau-cesium-helpers'
import {
  layersAtom,
  layerSelectionAtom,
  useAddLayer,
  type LayerModel
} from '@takram/plateau-layers'
import { screenSpaceSelectionAtom } from '@takram/plateau-screen-space-selection'
import {
  SKETCH_OBJECT,
  SketchTool as SketchToolComponent,
  type SketchFeature
} from '@takram/plateau-sketch'
import {
  createViewLayer,
  highlightedSketchLayersAtom,
  SKETCH_LAYER
} from '@takram/plateau-view-layers'

import {
  modalToolAtom,
  momentaryToolAtom,
  sketchTypeAtom
} from '../states/tool'

const targetSketchLayerAtom = atom<LayerModel<typeof SKETCH_LAYER> | null>(
  get => {
    const layers = get(layersAtom)
    const selection = get(layerSelectionAtom)
    const selectedSketchLayers = layers.filter(
      (layer): layer is LayerModel<typeof SKETCH_LAYER> =>
        layer.type === SKETCH_LAYER && selection.includes(layer.id)
    )
    const highlightedSketchLayers = get(highlightedSketchLayersAtom)
    if (selectedSketchLayers.length === 0) {
      return highlightedSketchLayers[0] ?? null
    }
    return selectedSketchLayers[0] ?? null
  }
)

const addFeatureAtom = atom(null, (get, set, value: SketchFeature) => {
  const layer = get(targetSketchLayerAtom)
  if (layer == null) {
    return
  }
  set(layer.featureAtomsAtom, {
    type: 'insert',
    value
  })
})

const Wrapped: FC = () => {
  const layer = useAtomValue(targetSketchLayerAtom)
  const addFeature = useSetAtom(addFeatureAtom)
  const addLayer = useAddLayer()
  const setScreenSpaceSelection = useSetAtom(screenSpaceSelectionAtom)

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
        addLayer(layer, { autoSelect: false })
      }
      setScreenSpaceSelection([
        {
          type: SKETCH_OBJECT,
          value: compose({ type: 'Sketch', key: feature.properties.id })
        }
      ])
    },
    [layer, addFeature, addLayer, setScreenSpaceSelection]
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
