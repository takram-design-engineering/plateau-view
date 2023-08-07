import { styled } from '@mui/material'
import { useAtom } from 'jotai'
import { atomWithReset } from 'jotai/utils'
import { useCallback, type FC, type ReactNode } from 'react'

import {
  useMunicipalityDatasetsQuery,
  usePrefectureMunicipalitiesQuery,
  usePrefecturesQuery,
  type PlateauDatasetFragment,
  type PlateauDatasetType,
  type PlateauMunicipalityFragment,
  type PlateauPrefectureFragment
} from '@takram/plateau-graphql'
import { DatasetTreeItem, DatasetTreeView } from '@takram/plateau-ui-components'

import { datasetTypeIcons } from '../constants/datasetTypeIcons'
import { datasetTypeNames } from '../constants/datasetTypeNames'
import { datasetTypeOrder } from '../constants/datasetTypeOrder'

const expandedAtom = atomWithReset<string[]>([])

const Delimiter = styled('span')(({ theme }) => ({
  margin: `0 0.5em`,
  color: theme.palette.text.disabled
}))

function joinPath(values: string[]): ReactNode {
  return (values as ReactNode[]).reduce((prev, curr, index) => [
    prev,
    <Delimiter key={index}>/</Delimiter>,
    curr
  ])
}

const DatasetItem: FC<{
  datasetType: PlateauDatasetType
  dataset: PlateauDatasetFragment
  parents: string[]
  showName?: boolean
}> = ({ datasetType, dataset, parents, showName = false }) => {
  const Icon = datasetTypeIcons[dataset.type]
  return (
    <DatasetTreeItem
      nodeId={`${datasetType}:${dataset.id}`}
      label={showName ? dataset.name : joinPath(parents)}
      icon={<Icon />}
    />
  )
}

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
      <DatasetItem
        datasetType={datasetType}
        dataset={query.data.municipality.datasets[0]}
        parents={[...parents, municipality.name]}
      />
    )
  }
  return (
    <DatasetTreeItem
      nodeId={`${datasetType}:${municipality.code}`}
      label={joinPath([...parents, municipality.name])}
      disabled={query.loading}
    >
      {query.data?.municipality?.datasets?.map(dataset => (
        <DatasetItem
          key={dataset.id}
          datasetType={datasetType}
          dataset={dataset}
          parents={[...parents, municipality.name]}
          showName
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
      disabled={query.loading}
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
      disabled={query.loading}
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
