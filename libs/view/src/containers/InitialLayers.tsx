import { useEffect, type FC } from 'react'

import { useAddLayer } from '@takram/plateau-layers'
import {
  BUILDING_LAYER,
  createViewLayer,
  PEDESTRIAN_LAYER
} from '@takram/plateau-view-layers'

export const InitialLayers: FC = () => {
  const addLayer = useAddLayer()

  useEffect(() => {
    const remove = [
      addLayer(
        createViewLayer({
          type: BUILDING_LAYER,
          municipalityCode: '13101',
          version: '2020',
          lod: 2,
          textured: false
        }),
        { autoSelect: false }
      ),
      addLayer(
        createViewLayer({
          type: BUILDING_LAYER,
          municipalityCode: '13102',
          version: '2020',
          lod: 2,
          textured: false
        }),
        { autoSelect: false }
      ),
      addLayer(
        createViewLayer({
          type: PEDESTRIAN_LAYER,
          location: {
            longitude: 139.769,
            latitude: 35.68
          }
        }),
        { autoSelect: false }
      )
    ]
    return () => {
      remove.forEach(remove => {
        remove()
      })
    }
  }, [addLayer])

  return null
}
