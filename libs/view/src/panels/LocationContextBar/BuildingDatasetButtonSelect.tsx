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
  type PlateauBuildingDatasetVariant,
  type PlateauDatasetFragment
} from '@plateau/graphql'
import { useAddLayer, useFindLayer, useLayers } from '@plateau/layers'
import { ContextButtonSelect, SelectItem } from '@plateau/ui-components'
import { BUILDING_LAYER, createBuildingLayer } from '@plateau/view-layers'

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
  const find = useFindLayer()
  const layer = useMemo(
    () =>
      find(layers, {
        type: BUILDING_LAYER,
        municipalityCode
      }),
    [municipalityCode, layers, find]
  )

  const add = useAddLayer()
  const remove = useSetAtom(removeAtom)
  const paramsAtom = useMemo(() => {
    if (layer == null) {
      return atom(null, (get, set, params?: SetStateAction<Params | null>) => {
        const nextParams = typeof params === 'function' ? params(null) : params
        if (nextParams == null) {
          return
        }
        add(
          createBuildingLayer({
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
          remove(layer.id)
        } else {
          set(layer.versionAtom, nextParams.version)
          set(layer.lodAtom, nextParams.lod)
        }
      }
    )
  }, [municipalityCode, layer, add, remove])

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

  // Remove textured variants from our menu.
  const variants = uniqWith(
    dataset.variants as PlateauBuildingDatasetVariant[],
    (a, b) => a.version === b.version && a.lod === b.lod
  )

  return (
    <ContextButtonSelect
      label={dataset.typeName}
      value={params != null ? serializeParams(params) : ''}
      disabled={disabled}
      onClick={handleClick}
      onChange={handleChange}
    >
      {variants.map(variant => {
        const value = serializeParams(variant)
        return (
          <SelectItem key={value} value={value}>
            <Stack>
              <Typography variant='body2'>LOD {variant.lod}</Typography>
              <Typography variant='caption' color='text.secondary'>
                {variant.version}年度
              </Typography>
            </Stack>
          </SelectItem>
        )
      })}
    </ContextButtonSelect>
  )
}
