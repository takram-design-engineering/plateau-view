import { IconButton, styled, useMediaQuery, useTheme } from '@mui/material'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import {
  useCallback,
  useMemo,
  useState,
  type FC,
  type MouseEvent,
  type ReactNode
} from 'react'

import {
  PlateauDatasetType,
  type PlateauDatasetFragment
} from '@takram/plateau-graphql'
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
import { BUILDING_LAYER, createViewLayer } from '@takram/plateau-view-layers'

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
  // TODO: Separate into hook
  const layer = useAtomValue(
    useMemo(
      () =>
        atom(get =>
          dataset.type === PlateauDatasetType.Building
            ? get(layersAtom).find(
                layer =>
                  // TODO: Why the type of layer isn't reduced to
                  // BuildingLayerModel?
                  layer.type === BUILDING_LAYER &&
                  'municipalityCode' in layer &&
                  layer.municipalityCode === municipalityCode
              )
            : get(layersAtom).find(
                layer =>
                  'isDatasetLayer' in layer && layer.datasetId === dataset.id
              )
        ),
      [municipalityCode, dataset]
    )
  )

  const layerType = datasetTypeLayers[dataset.type]
  const addLayer = useAddLayer()
  const removeLayer = useSetAtom(removeLayerAtom)
  const theme = useTheme()
  const smDown = useMediaQuery(theme.breakpoints.down('sm'))
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
        }),
        { autoSelect: !smDown }
      )
    } else {
      removeLayer(layer.id)
    }
  }, [
    municipalityCode,
    dataset,
    layer,
    layerType,
    addLayer,
    removeLayer,
    smDown
  ])

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
        municipalityCode={municipalityCode}
        dataset={dataset}
        onClose={handleInfoClose}
      />
    </>
  )
}
