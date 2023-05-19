import { useAtomValue, useSetAtom } from 'jotai'
import { useCallback, useMemo, type FC } from 'react'

import { type PlateauDatasetFragment } from '@plateau/graphql'
import { useAddLayer, useFindLayer, useLayers } from '@plateau/layers'
import { ContextButton } from '@plateau/ui-components'
import { BRIDGE_LAYER, createBridgeLayer } from '@plateau/view-layers'

import { layerTypes } from './layerTypes'

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
  const layerType = layerTypes[dataset.type as keyof typeof layerTypes]
  const find = useFindLayer()
  const layer = useMemo(
    () =>
      layerType != null
        ? find(layers, {
            type: layerType,
            municipalityCode
          })
        : undefined,
    [municipalityCode, layers, layerType, find]
  )

  const add = useAddLayer()
  const remove = useSetAtom(removeAtom)

  const handleClick = useCallback(() => {
    if (layerType == null) {
      return
    }
    if (layer == null) {
      switch (layerType) {
        case BRIDGE_LAYER:
          add(
            createBridgeLayer({
              municipalityCode
            })
          )
          break
        default:
          break
      }
    } else {
      remove(layer.id)
    }
  }, [municipalityCode, layer, layerType, add, remove])

  const variant = dataset.variants[0]
  if (variant == null) {
    console.warn('Dataset must includes at least 1 variant.')
    return null
  }
  return (
    <ContextButton
      selected={layer != null}
      disabled={disabled || layerType == null}
      onClick={handleClick}
    >
      {dataset.typeName}
    </ContextButton>
  )
}
