import { useAtomValue, useSetAtom } from 'jotai'
import { useCallback, useMemo, type FC } from 'react'

import { type PlateauDatasetFragment } from '@plateau/graphql'
import { useAddLayer, useFindLayer, useLayers } from '@plateau/layers'
import { ContextButton } from '@plateau/ui-components'
import { BRIDGE_LAYER, createBridgeLayer } from '@plateau/view-layers'

import { datasetTypeLayers } from '../../constants/datasetTypeLayers'
import { datasetTypeNames } from '../../constants/datasetTypeNames'

export interface DefaultDatasetButtonProps {
  dataset: PlateauDatasetFragment
  municipalityCode: string
  disabled?: boolean
}

export const DefaultDatasetButton: FC<DefaultDatasetButtonProps> = ({
  dataset,
  municipalityCode,
  disabled = false
}) => {
  const { layersAtom, removeAtom } = useLayers()
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
  const removeLayer = useSetAtom(removeAtom)

  const handleClick = useCallback(() => {
    if (layerType == null) {
      return
    }
    if (layer == null) {
      switch (layerType) {
        case BRIDGE_LAYER:
          addLayer(
            createBridgeLayer({
              municipalityCode
            })
          )
          break
        default:
          break
      }
    } else {
      removeLayer(layer.id)
    }
  }, [municipalityCode, layer, layerType, addLayer, removeLayer])

  const variant = dataset.variants[0]
  if (variant == null) {
    console.warn('Dataset must include at least 1 variant.')
    return null
  }
  return (
    <ContextButton
      selected={layer != null}
      disabled={disabled || layerType == null}
      onClick={handleClick}
    >
      {datasetTypeNames[dataset.type]}
    </ContextButton>
  )
}
