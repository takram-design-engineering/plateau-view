import { IconButton, styled } from '@mui/material'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import {
  useCallback,
  useMemo,
  useState,
  type FC,
  type MouseEvent,
  type ReactNode
} from 'react'

import { type PlateauDatasetFragment } from '@takram/plateau-graphql'
import {
  layersAtom,
  removeLayerAtom,
  useAddLayer
} from '@takram/plateau-layers'
import {
  DatasetTreeItem,
  InfoIcon,
  type DatasetTreeItemProps
} from '@takram/plateau-ui-components'
import { createViewLayer } from '@takram/plateau-view-layers'

import { datasetTypeIcons } from '../constants/datasetTypeIcons'
import { datasetTypeLayers } from '../constants/datasetTypeLayers'
import { DatasetDialog } from './DatasetDialog'

const Delimiter = styled('span')(({ theme }) => ({
  margin: `0 0.5em`,
  color: theme.palette.text.disabled
}))

export function joinPath(values: string[]): ReactNode {
  return (values as ReactNode[]).reduce((prev, curr, index) => [
    prev,
    <Delimiter key={index}>/</Delimiter>,
    curr
  ])
}

export interface DatasetListItemProps
  extends Omit<DatasetTreeItemProps, 'nodeId' | 'icon' | 'secondaryAction'> {
  municipalityCode: string
  dataset: PlateauDatasetFragment
}

export const DatasetListItem: FC<DatasetListItemProps> = ({
  municipalityCode,
  dataset,
  ...props
}) => {
  const layer = useAtomValue(
    useMemo(
      () =>
        atom(get =>
          get(layersAtom).find(layer => {
            if ('isDatasetLayer' in layer) {
              return layer.datasetId === dataset.id
            }
            return false
          })
        ),
      [dataset]
    )
  )

  const layerType = datasetTypeLayers[dataset.type]
  const addLayer = useAddLayer()
  const removeLayer = useSetAtom(removeLayerAtom)
  const handleClick = useCallback(() => {
    if (layerType == null) {
      return
    }
    if (layer == null) {
      addLayer(
        createViewLayer({
          type: layerType,
          municipalityCode,
          datasetId: dataset.id,
          datumId: dataset.data[0]?.id
        })
      )
    } else {
      removeLayer(layer.id)
    }
  }, [municipalityCode, dataset, layer, layerType, addLayer, removeLayer])

  const [infoOpen, setInfoOpen] = useState(false)
  const handleInfo = useCallback((event: MouseEvent) => {
    event.stopPropagation()
    setInfoOpen(true)
  }, [])
  const handleInfoClose = useCallback(() => {
    setInfoOpen(false)
  }, [])

  const Icon = datasetTypeIcons[dataset.type]
  return (
    <>
      <DatasetTreeItem
        nodeId={dataset.id}
        icon={<Icon />}
        selected={layer != null}
        disabled={layerType == null}
        secondaryAction={
          <IconButton size='small' onClick={handleInfo}>
            <InfoIcon />
          </IconButton>
        }
        onClick={handleClick}
        {...props}
      />
      <DatasetDialog
        open={infoOpen}
        dataset={dataset}
        onClose={handleInfoClose}
      />
    </>
  )
}
