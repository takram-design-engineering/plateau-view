import { Math as CesiumMath, type Cartographic } from '@cesium/engine'
import { useAtomValue, useSetAtom } from 'jotai'
import { nanoid } from 'nanoid'
import { useCallback, type FC } from 'react'

import { useAddLayer } from '@takram/plateau-layers'
import { PedestrianTool as PedestrianToolComponent } from '@takram/plateau-pedestrian'
import { createViewLayer, PEDESTRIAN_LAYER } from '@takram/plateau-view-layers'

import { toolAtom, toolMachineAtom } from '../states/tool'

export const PedestrianTool: FC = () => {
  const send = useSetAtom(toolMachineAtom)
  const tool = useAtomValue(toolAtom)

  const addLayer = useAddLayer()
  const handleClick = useCallback(
    (location: Cartographic) => {
      const id = nanoid()
      const layer = createViewLayer({
        id,
        type: PEDESTRIAN_LAYER,
        location: {
          longitude: CesiumMath.toDegrees(location.longitude),
          latitude: CesiumMath.toDegrees(location.latitude)
        }
      })
      addLayer(layer)
      send({ type: 'HAND' })
    },
    [addLayer, send]
  )

  if (tool !== 'pedestrian') {
    return null
  }
  return <PedestrianToolComponent onClick={handleClick} />
}
