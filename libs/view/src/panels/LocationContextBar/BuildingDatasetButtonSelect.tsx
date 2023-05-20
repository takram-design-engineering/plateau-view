import { Stack, Typography, type SelectChangeEvent } from '@mui/material'
import {
  atom,
  useAtom,
  useAtomValue,
  useSetAtom,
  type SetStateAction
} from 'jotai'
import stringify from 'json-stable-stringify'
import { pick, uniqWith } from 'lodash'
import { useCallback, useMemo, type FC } from 'react'

import {
  type PlateauBuildingDatasetDatum,
  type PlateauDatasetFragment
} from '@takram/plateau-graphql'
import { useAddLayer, useFindLayer, useLayers } from '@takram/plateau-layers'
import { ContextButtonSelect, SelectItem } from '@takram/plateau-ui-components'
import { BUILDING_LAYER, createViewLayer } from '@takram/plateau-view-layers'

import { datasetTypeNames } from '../../constants/datasetTypeNames'

interface Params {
  version: string | null
  lod: number | null
}

function serializeParams(params: Params): string {
  return stringify(pick(params, ['version', 'lod']))
}

function parseParams(value: string): Params {
  return JSON.parse(value)
}

export interface BuildingDatasetButtonSelectProps {
  dataset: PlateauDatasetFragment & {
    __typename?: 'PlateauBuildingDataset'
  }
  municipalityCode: string
  disabled?: boolean
}

export const BuildingDatasetButtonSelect: FC<
  BuildingDatasetButtonSelectProps
> = ({ dataset, municipalityCode, disabled }) => {
  const { layersAtom, removeAtom } = useLayers()
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
  const removeLayer = useSetAtom(removeAtom)
  const paramsAtom = useMemo(() => {
    if (layer == null) {
      return atom(null, (get, set, params?: SetStateAction<Params | null>) => {
        const nextParams = typeof params === 'function' ? params(null) : params
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
      })
    }

    return atom(
      get => ({
        version: get(layer.versionAtom),
        lod: get(layer.lodAtom)
      }),
      (get, set, params?: SetStateAction<Params | null>) => {
        const nextParams =
          typeof params === 'function'
            ? params({
                version: get(layer.versionAtom),
                lod: get(layer.lodAtom)
              })
            : params
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

  if (data.length === 0) {
    console.warn('Dataset must include at least 1 datum.')
    return null
  }
  return (
    <ContextButtonSelect
      label={datasetTypeNames[dataset.type]}
      value={params != null ? serializeParams(params) : ''}
      disabled={disabled}
      onClick={handleClick}
      onChange={handleChange}
    >
      {data.map(datum => {
        const value = serializeParams(datum)
        return (
          <SelectItem key={value} value={value}>
            <Stack>
              <Typography variant='body2'>LOD {datum.lod}</Typography>
              <Typography variant='caption' color='text.secondary'>
                {datum.version}年度
              </Typography>
            </Stack>
          </SelectItem>
        )
      })}
    </ContextButtonSelect>
  )
}
