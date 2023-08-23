import { useAtomValue } from 'jotai'
import { nanoid } from 'nanoid'
import { useCallback, type FC } from 'react'

import { useAddLayer } from '@takram/plateau-layers'
import {
  SketchTool as SketchToolComponent,
  type SketchFeature
} from '@takram/plateau-sketch'
import { createViewLayer, SKETCH_LAYER } from '@takram/plateau-view-layers'

import { toolAtom } from '../states/tool'

export const SketchTool: FC = () => {
  const tool = useAtomValue(toolAtom)

  const addLayer = useAddLayer()
  const handleCreate = useCallback(
    (feature: SketchFeature) => {
      const id = nanoid()
      const layer = createViewLayer({
        id,
        type: SKETCH_LAYER,
        features: [feature]
      })
      addLayer(layer)
    },
    [addLayer]
  )

  if (tool !== 'sketch') {
    return null
  }
  return <SketchToolComponent onCreate={handleCreate} />
}
