import { useAtom } from 'jotai'
import { atomWithReset } from 'jotai/utils'
import { useCallback, type FC } from 'react'

import {
  useMunicipalityDatasetsQuery,
  usePrefectureMunicipalitiesQuery,
  usePrefecturesQuery,
  type PlateauDatasetType,
  type PlateauMunicipalityFragment,
  type PlateauPrefectureFragment
} from '@takram/plateau-graphql'
import { DatasetTreeItem, DatasetTreeView } from '@takram/plateau-ui-components'

import { datasetTypeNames } from '../constants/datasetTypeNames'
import { datasetTypeOrder } from '../constants/datasetTypeOrder'
import { DatasetListItem, joinPath } from './DatasetListItem'

const expandedAtom = atomWithReset<string[]>([])

const MunicipalityItem: FC<{
  datasetType: PlateauDatasetType
  municipality: PlateauMunicipalityFragment
  parents?: string[]
}> = ({ datasetType, municipality, parents = [] }) => {
  const query = useMunicipalityDatasetsQuery({
    variables: {
      municipalityCode: municipality.code,
      includeTypes: [datasetType]
    }
  })
  if (query.data?.municipality?.datasets.length === 1) {
    return (
      <DatasetListItem
        municipalityCode={municipality.code}
        dataset={query.data.municipality.datasets[0]}
        label={joinPath([...parents, municipality.name])}
      />
    )
  }
  return (
    <DatasetTreeItem
      nodeId={`${datasetType}:${municipality.code}`}
      label={joinPath([...parents, municipality.name])}
      loading={query.loading}
    >
      {query.data?.municipality?.datasets?.map(dataset => (
        <DatasetListItem
          key={dataset.id}
          municipalityCode={municipality.code}
          dataset={dataset}
          label={dataset.name}
        />
      ))}
    </DatasetTreeItem>
  )
}

const PrefectureItem: FC<{
  datasetType: PlateauDatasetType
  prefecture: PlateauPrefectureFragment
}> = ({ prefecture, datasetType }) => {
  const query = usePrefectureMunicipalitiesQuery({
    variables: {
      prefectureCode: prefecture.code,
      datasetType
    }
  })
  if (query.data?.municipalities.length === 1) {
    return (
      <MunicipalityItem
        datasetType={datasetType}
        municipality={query.data.municipalities[0]}
        parents={[prefecture.name]}
      />
    )
  }
  return (
    <DatasetTreeItem
      nodeId={`${datasetType}:${prefecture.code}`}
      label={prefecture.name}
      loading={query.loading}
    >
      {query.data?.municipalities.map(municipality => (
        <MunicipalityItem
          key={municipality.code}
          datasetType={datasetType}
          municipality={municipality}
        />
      ))}
    </DatasetTreeItem>
  )
}

const DatasetTypeItem: FC<{ datasetType: PlateauDatasetType }> = ({
  datasetType
}) => {
  const query = usePrefecturesQuery({
    variables: {
      datasetType
    }
  })
  return (
    <DatasetTreeItem
      nodeId={datasetType}
      label={datasetTypeNames[datasetType]}
      loading={query.loading}
    >
      {query.data?.prefectures.map(prefecture => (
        <PrefectureItem
          key={prefecture.code}
          datasetType={datasetType}
          prefecture={prefecture}
        />
      ))}
    </DatasetTreeItem>
  )
}

export const DatasetTypeList: FC = () => {
  const [expanded, setExpanded] = useAtom(expandedAtom)
  const handleNodeToggle = useCallback(
    (event: unknown, nodeIds: string[]) => {
      setExpanded(nodeIds)
    },
    [setExpanded]
  )
  return (
    <DatasetTreeView expanded={expanded} onNodeToggle={handleNodeToggle}>
      {datasetTypeOrder.map(datasetType => (
        <DatasetTypeItem key={datasetType} datasetType={datasetType} />
      ))}
    </DatasetTreeView>
  )
}
