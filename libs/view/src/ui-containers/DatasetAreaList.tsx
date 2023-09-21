import { useAtom } from 'jotai'
import { atomWithReset } from 'jotai/utils'
import { groupBy } from 'lodash'
import { useCallback, useMemo, type FC } from 'react'
import invariant from 'tiny-invariant'

import {
  PlateauDatasetType,
  useMunicipalityDatasetsQuery,
  usePrefectureMunicipalitiesQuery,
  usePrefecturesQuery,
  type PlateauDatasetFragment,
  type PlateauMunicipalityFragment,
  type PlateauPrefectureFragment
} from '@takram/plateau-graphql'
import { DatasetTreeItem, DatasetTreeView } from '@takram/plateau-ui-components'

import { censusDatasets } from '../constants/censusDatasets'
import { datasetTypeOrder } from '../constants/datasetTypeOrder'
import { CensusDatasetListItem } from './CensusDatasetListItem'
import { DatasetListItem, joinPath } from './DatasetListItem'

const expandedAtom = atomWithReset<string[]>([])

const DatasetGroup: FC<{
  groupId: string
  municipalityCode: string
  datasets: PlateauDatasetFragment[]
}> = ({ groupId, municipalityCode, datasets }) => {
  invariant(datasets.length > 0)
  if (datasets.length > 1) {
    return (
      <DatasetTreeItem nodeId={groupId} label={datasets[0].typeName}>
        {datasets.map(dataset => (
          <DatasetListItem
            key={dataset.id}
            municipalityCode={municipalityCode}
            dataset={dataset}
            label={dataset.name}
          />
        ))}
      </DatasetTreeItem>
    )
  }
  return (
    <DatasetListItem
      municipalityCode={municipalityCode}
      dataset={datasets[0]}
      label={datasets[0].typeName}
    />
  )
}

const MunicipalityItem: FC<{
  municipality: PlateauMunicipalityFragment
  parents?: string[]
}> = ({ municipality, parents = [] }) => {
  const query = useMunicipalityDatasetsQuery({
    variables: {
      municipalityCode: municipality.code,
      excludeTypes: [
        PlateauDatasetType.UseCase,
        PlateauDatasetType.GenericCityObject
      ]
    }
  })
  const groups = useMemo(
    () =>
      query.data?.municipality?.datasets != null
        ? Object.entries(groupBy(query.data.municipality.datasets, 'type'))
            .map(([, value]) => value)
            .sort(
              (a, b) =>
                datasetTypeOrder.indexOf(a[0].type) -
                datasetTypeOrder.indexOf(b[0].type)
            )
            .map(value => ({
              groupId: value.map(({ id }) => id).join(':'),
              datasets: value
            }))
        : undefined,
    [query.data?.municipality?.datasets]
  )
  if (query.data?.municipality?.datasets.length === 1) {
    const dataset = query.data.municipality.datasets[0]
    return (
      <DatasetListItem
        municipalityCode={query.data.municipality.code}
        dataset={dataset}
        label={joinPath([...parents, municipality.name, dataset.typeName])}
      />
    )
  }
  return (
    <DatasetTreeItem
      nodeId={municipality.code}
      label={joinPath([...parents, municipality.name])}
      loading={query.loading}
    >
      {groups?.map(({ groupId, datasets }) => {
        invariant(query.data?.municipality?.code != null)
        return (
          <DatasetGroup
            key={groupId}
            groupId={groupId}
            municipalityCode={query.data.municipality.code}
            datasets={datasets}
          />
        )
      })}
    </DatasetTreeItem>
  )
}

const PrefectureItem: FC<{
  prefecture: PlateauPrefectureFragment
}> = ({ prefecture }) => {
  const query = usePrefectureMunicipalitiesQuery({
    variables: {
      prefectureCode: prefecture.code
    }
  })
  if (query.data?.municipalities.length === 1) {
    return (
      <MunicipalityItem
        municipality={query.data.municipalities[0]}
        parents={[prefecture.name]}
      />
    )
  }
  return (
    <DatasetTreeItem
      nodeId={prefecture.code}
      label={prefecture.name}
      loading={query.loading}
    >
      {query.data?.municipalities.map(municipality => (
        <MunicipalityItem key={municipality.code} municipality={municipality} />
      ))}
    </DatasetTreeItem>
  )
}

const RegionalMeshItem: FC = () => {
  return (
    <DatasetTreeItem nodeId='RegionalMesh' label='地域メッシュ'>
      {censusDatasets.map(dataset => (
        <DatasetTreeItem
          key={dataset.name}
          nodeId={`RegionalMesh:${dataset.name}`}
          label={dataset.name}
        >
          {dataset.data.map(data => (
            <CensusDatasetListItem
              key={data.name}
              dataset={dataset}
              data={data}
            />
          ))}
        </DatasetTreeItem>
      ))}
    </DatasetTreeItem>
  )
}

export const DatasetAreaList: FC = () => {
  const query = usePrefecturesQuery()
  const [expanded, setExpanded] = useAtom(expandedAtom)
  const handleNodeToggle = useCallback(
    (event: unknown, nodeIds: string[]) => {
      setExpanded(nodeIds)
    },
    [setExpanded]
  )
  return (
    <DatasetTreeView expanded={expanded} onNodeToggle={handleNodeToggle}>
      <RegionalMeshItem />
      {query.data?.prefectures.map(prefecture => (
        <PrefectureItem key={prefecture.code} prefecture={prefecture} />
      ))}
    </DatasetTreeView>
  )
}
