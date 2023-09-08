import { useCallback, type FC } from 'react'
import format from 'string-template'

import { useAddLayer } from '@takram/plateau-layers'
import {
  DatasetIcon,
  DatasetTreeItem,
  type DatasetTreeItemProps
} from '@takram/plateau-ui-components'
import { createViewLayer, HEATMAP_LAYER } from '@takram/plateau-view-layers'

import {
  censusDatasetMeshCodes,
  type CensusDataset,
  type CensusDatasetDatum
} from '../constants/censusDatasets'

export interface CensusDatasetListItemProps
  extends Omit<DatasetTreeItemProps, 'nodeId' | 'icon' | 'secondaryAction'> {
  dataset: CensusDataset
  data: CensusDatasetDatum
}

export const CensusDatasetListItem: FC<CensusDatasetListItemProps> = ({
  dataset,
  data,
  ...props
}) => {
  const addLayer = useAddLayer()
  const handleClick = useCallback(() => {
    const baseUrl = process.env.NEXT_PUBLIC_DATA_BASE_URL
    addLayer(
      createViewLayer({
        type: HEATMAP_LAYER,
        title: data.name,
        getUrl: code => `${baseUrl}${format(dataset.urlTemplate, { code })}`,
        codes: censusDatasetMeshCodes,
        parserOptions: {
          codeColumn: 0,
          valueColumn: data.column,
          skipHeader: 2
        }
      })
    )
  }, [dataset, data, addLayer])

  return (
    <DatasetTreeItem
      nodeId={`${dataset.name}:${data.name}`}
      label={data.name}
      icon={<DatasetIcon />}
      onClick={handleClick}
      {...props}
    />
  )
}
