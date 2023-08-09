import { Stack, Typography, type SelectChangeEvent } from '@mui/material'
import {
  atom,
  useAtom,
  useAtomValue,
  useSetAtom,
  type Getter,
  type SetStateAction
} from 'jotai'
import { uniqWith } from 'lodash'
import { memo, useCallback, useMemo, type FC } from 'react'

import {
  type PlateauBuildingDatasetDatum,
  type PlateauDatasetFragment
} from '@takram/plateau-graphql'
import {
  layersAtom,
  removeLayerAtom,
  useAddLayer,
  useFindLayer,
  type LayerModel
} from '@takram/plateau-layers'
import { ContextButtonSelect, SelectItem } from '@takram/plateau-ui-components'
import { BUILDING_LAYER, createViewLayer } from '@takram/plateau-view-layers'

import { datasetTypeNames } from '../constants/datasetTypeNames'
import { showDataFormatsAtom } from '../states/app'

interface Params {
  version: string | null
  lod: number | null
}

function createParams(
  get: Getter,
  layer: LayerModel<typeof BUILDING_LAYER>
): Params {
  return {
    version: get(layer.versionAtom),
    lod: get(layer.lodAtom)
  }
}

function serializeParams({ version, lod }: Params): string {
  return JSON.stringify([version, lod])
}

function parseParams(value: string): Params {
  const [version, lod] = JSON.parse(value)
  return { version, lod }
}

export interface BuildingDatasetButtonSelectProps {
  dataset: PlateauDatasetFragment & {
    __typename?: 'PlateauBuildingDataset'
  }
  municipalityCode: string
  disabled?: boolean
}

export const BuildingDatasetButtonSelect: FC<BuildingDatasetButtonSelectProps> =
  memo(({ dataset, municipalityCode, disabled }) => {
    const layers = useAtomValue(layersAtom)
    const findLayer = useFindLayer()
    const layer = useMemo(
      () =>
        findLayer(layers, {
          type: BUILDING_LAYER,
          municipalityCode
        }),
      [municipalityCode, layers, findLayer]
    )

    const addLayer = useAddLayer()
    const removeLayer = useSetAtom(removeLayerAtom)
    const paramsAtom = useMemo(() => {
      if (layer == null) {
        return atom(
          null,
          (get, set, params?: SetStateAction<Params | null>) => {
            const nextParams =
              typeof params === 'function' ? params(null) : params
            if (nextParams == null) {
              return
            }
            addLayer(
              createViewLayer({
                type: BUILDING_LAYER,
                municipalityCode,
                version: nextParams.version ?? undefined,
                lod: nextParams.lod ?? undefined
              })
            )
          }
        )
      }

      return atom(
        get => createParams(get, layer),
        (get, set, params?: SetStateAction<Params | null>) => {
          const prevParams = createParams(get, layer)
          const nextParams =
            typeof params === 'function' ? params(prevParams) : params

          if (nextParams == null) {
            removeLayer(layer.id)
          } else {
            set(layer.versionAtom, nextParams.version)
            set(layer.lodAtom, nextParams.lod)
          }
        }
      )
    }, [municipalityCode, layer, addLayer, removeLayer])

    const [params, setParams] = useAtom(paramsAtom)

    const handleClick = useCallback(() => {
      if (layer == null) {
        setParams({
          version: null,
          lod: null
        })
      } else {
        setParams(null)
      }
    }, [layer, setParams])

    const handleChange = useCallback(
      (event: SelectChangeEvent<string>) => {
        if (event.target.value === '') {
          setParams()
        } else {
          setParams(parseParams(event.target.value))
        }
      },
      [setParams]
    )

    // Remove textured data from our menu.
    const data = uniqWith(
      dataset.data as PlateauBuildingDatasetDatum[],
      (a, b) => a.version === b.version && a.lod === b.lod
    )

    const value = useMemo(
      () => (params != null ? serializeParams(params) : ''),
      [params]
    )

    const showDataFormats = useAtomValue(showDataFormatsAtom)

    if (data.length === 0) {
      console.warn('Dataset must include at least 1 datum.')
      return null
    }

    return (
      <ContextButtonSelect
        label={datasetTypeNames[dataset.type]}
        value={value}
        disabled={disabled}
        onClick={handleClick}
        onChange={handleChange}
      >
        {data.map(datum => (
          <SelectItem key={datum.id} value={serializeParams(datum)}>
            <Stack>
              <Typography variant='body2'>
                LOD {datum.lod}
                {showDataFormats ? ` (${datum.format})` : null}
              </Typography>
              <Typography variant='caption' color='text.secondary'>
                {datum.version}年度
              </Typography>
            </Stack>
          </SelectItem>
        ))}
      </ContextButtonSelect>
    )
  })
