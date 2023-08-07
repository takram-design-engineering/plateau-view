import { Typography, type SelectChangeEvent } from '@mui/material'
import {
  atom,
  useAtom,
  useAtomValue,
  useSetAtom,
  type Getter,
  type SetStateAction
} from 'jotai'
import { differenceBy } from 'lodash'
import { memo, useCallback, useMemo, type FC } from 'react'
import invariant from 'tiny-invariant'

import { type PlateauDatasetFragment } from '@takram/plateau-graphql'
import {
  layersAtom,
  removeLayerAtom,
  useAddLayer,
  useFilterLayers
} from '@takram/plateau-layers'
import { isNotNullish } from '@takram/plateau-type-helpers'
import {
  ContextSelect,
  SelectGroupItem,
  SelectItem
} from '@takram/plateau-ui-components'
import {
  createViewLayer,
  type DatasetLayerModel
} from '@takram/plateau-view-layers'

import { datasetTypeLayers } from '../constants/datasetTypeLayers'
import { datasetTypeNames } from '../constants/datasetTypeNames'
import { showDataFormatsAtom } from '../states/app'

interface Params {
  datasetId: string
  datumId: string
}

function createParamsArray(
  get: Getter,
  layers: readonly DatasetLayerModel[]
): Params[] {
  return layers
    .map(({ datasetId, datumIdAtom }) => {
      const datumId = get(datumIdAtom)
      return datumId != null ? { datasetId, datumId } : undefined
    })
    .filter(isNotNullish)
}

function serializeParams({ datasetId, datumId }: Params): string {
  return JSON.stringify([datasetId, datumId])
}

function parseParams(value: string): Params {
  const [datasetId, datumId] = JSON.parse(value)
  return { datasetId, datumId }
}

export interface DefaultDatasetSelectProps {
  datasets: PlateauDatasetFragment[]
  municipalityCode: string
  disabled?: boolean
}

export const DefaultDatasetSelect: FC<DefaultDatasetSelectProps> = memo(
  ({ datasets, municipalityCode, disabled }) => {
    invariant(datasets.length > 0)
    const layers = useAtomValue(layersAtom)
    // Assume that all the datasets share the same type.
    const layerType = datasetTypeLayers[datasets[0].type]
    invariant(
      layerType !== 'BUILDING_LAYER',
      'Building layer is not supported.'
    )
    const filterLayers = useFilterLayers()
    const filteredLayers = useMemo(
      () =>
        layerType != null
          ? filterLayers(layers, {
              type: layerType,
              municipalityCode
            })
          : [],
      [municipalityCode, layers, layerType, filterLayers]
    )

    const addLayer = useAddLayer()
    const removeLayer = useSetAtom(removeLayerAtom)
    const paramsAtom = useMemo(() => {
      if (layerType == null) {
        return atom(null, (get, set, params: SetStateAction<Params[]>) => {})
      }

      return atom(
        get => createParamsArray(get, filteredLayers),
        (get, set, dataIds: SetStateAction<Params[]>) => {
          const prevParams = createParamsArray(get, filteredLayers)
          const nextParams =
            typeof dataIds === 'function' ? dataIds(prevParams) : dataIds

          const paramsToRemove = differenceBy(
            prevParams,
            nextParams,
            ({ datasetId }) => datasetId
          )
          const paramsToAdd = differenceBy(
            nextParams,
            prevParams,
            ({ datasetId }) => datasetId
          )
          const paramsToUpdate = nextParams.filter(({ datasetId, datumId }) =>
            prevParams.some(
              params =>
                params.datasetId === datasetId && params.datumId !== datumId
            )
          )
          paramsToRemove.forEach(({ datumId }) => {
            const layer = filteredLayers.find(
              ({ datumIdAtom }) => get(datumIdAtom) === datumId
            )
            invariant(layer != null)
            removeLayer(layer.id)
          })
          paramsToAdd.forEach(({ datasetId, datumId }) => {
            addLayer(
              createViewLayer({
                type: layerType,
                municipalityCode,
                datasetId,
                datumId
              })
            )
          })
          paramsToUpdate.forEach(({ datasetId, datumId }) => {
            const layer = filteredLayers.find(
              layer => layer.datasetId === datasetId
            )
            invariant(layer != null)
            set(layer.datumIdAtom, datumId)
          })
        }
      )
    }, [municipalityCode, filteredLayers, layerType, addLayer, removeLayer])

    const [params, setParams] = useAtom(paramsAtom)

    const handleChange = useCallback(
      (event: SelectChangeEvent<string[]>) => {
        invariant(Array.isArray(event.target.value))
        setParams(event.target.value.map(value => parseParams(value)))
      },
      [setParams]
    )

    const value = useMemo(
      () =>
        params != null ? params.map(params => serializeParams(params)) : [],
      [params]
    )

    const showDataFormats = useAtomValue(showDataFormatsAtom)
    return (
      <ContextSelect
        label={datasetTypeNames[datasets[0].type]}
        value={value}
        onChange={handleChange}
        disabled={disabled}
      >
        {datasets.flatMap((dataset, index) => {
          if (dataset.data.length > 1) {
            if (dataset.name === '') {
              return dataset.data.map(datum => (
                <SelectItem
                  key={datum.id}
                  value={serializeParams({
                    datasetId: dataset.id,
                    datumId: datum.id
                  })}
                >
                  <Typography variant='body2'>
                    {datum.name}
                    {showDataFormats ? ` (${datum.format})` : null}
                  </Typography>
                </SelectItem>
              ))
            }
            return [
              <SelectGroupItem key={index} size='small'>
                {dataset.name}
              </SelectGroupItem>,
              ...dataset.data.map(datum => (
                <SelectItem
                  key={datum.id}
                  indent={1}
                  value={serializeParams({
                    datasetId: dataset.id,
                    datumId: datum.id
                  })}
                >
                  <Typography variant='body2'>
                    {datum.name}
                    {showDataFormats ? ` (${datum.format})` : null}
                  </Typography>
                </SelectItem>
              ))
            ]
          }
          invariant(dataset.data.length === 1)
          const [datum] = dataset.data
          return (
            <SelectItem
              key={datum.id}
              value={serializeParams({
                datasetId: dataset.id,
                datumId: datum.id
              })}
            >
              <Typography variant='body2'>
                {dataset.name}
                {showDataFormats ? ` (${datum.format})` : null}
              </Typography>
            </SelectItem>
          )
        })}
      </ContextSelect>
    )
  }
)
