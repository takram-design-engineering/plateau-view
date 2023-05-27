import { useAtomValue, useSetAtom } from 'jotai'
import { memo, useCallback, useMemo, type FC } from 'react'

import { type PlateauDatasetFragment } from '@takram/plateau-graphql'
import {
  layersAtom,
  removeLayerAtom,
  useAddLayer,
  useFindLayer
} from '@takram/plateau-layers'
import { ContextButton } from '@takram/plateau-ui-components'
import {
  BRIDGE_LAYER,
  LANDSLIDE_LAYER,
  LANDUSE_LAYER,
  ROAD_LAYER,
  createViewLayer
} from '@takram/plateau-view-layers'

import { datasetTypeLayers } from '../../constants/datasetTypeLayers'
import { datasetTypeNames } from '../../constants/datasetTypeNames'
import { showDataFormatsAtom } from '../../states/app'

export interface DefaultDatasetButtonProps {
  dataset: PlateauDatasetFragment
  municipalityCode: string
  disabled?: boolean
}

export const DefaultDatasetButton: FC<DefaultDatasetButtonProps> = memo(
  ({ dataset, municipalityCode, disabled = false }) => {
    const layers = useAtomValue(layersAtom)
    const layerType = datasetTypeLayers[dataset.type]
    const findLayer = useFindLayer()
    const layer = useMemo(
      () =>
        layerType != null
          ? findLayer(layers, {
              type: layerType,
              municipalityCode
            })
          : undefined,
      [municipalityCode, layers, layerType, findLayer]
    )

    const addLayer = useAddLayer()
    const removeLayer = useSetAtom(removeLayerAtom)

    const handleClick = useCallback(() => {
      if (layerType == null) {
        return
      }
      if (layer == null) {
        switch (layerType) {
          case BRIDGE_LAYER:
          case ROAD_LAYER:
          case LANDUSE_LAYER:
          case LANDSLIDE_LAYER:
            addLayer(
              createViewLayer({
                type: layerType,
                municipalityCode,
                datasetId: dataset.id
              })
            )
            break
          default:
            break
        }
      } else {
        removeLayer(layer.id)
      }
    }, [dataset, municipalityCode, layer, layerType, addLayer, removeLayer])

    const datum = dataset.data[0]
    const showDataFormats = useAtomValue(showDataFormatsAtom)
    if (datum == null) {
      console.warn('Dataset must include at least 1 datum.')
      return null
    }
    return (
      <ContextButton
        selected={layer != null}
        disabled={disabled || layerType == null}
        onClick={handleClick}
      >
        {datasetTypeNames[dataset.type]}
        {showDataFormats ? ` (${datum.format})` : null}
      </ContextButton>
    )
  }
)
