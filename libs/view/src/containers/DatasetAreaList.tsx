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

import { datasetTypeIcons } from '../constants/datasetTypeIcons'
import { datasetTypeOrder } from '../constants/datasetTypeOrder'

const expandedAtom = atomWithReset<string[]>([])

const DatasetItem: FC<{
  dataset: PlateauDatasetFragment
  grouped?: boolean
}> = ({ dataset, grouped = false }) => {
  const Icon = datasetTypeIcons[dataset.type]
  return (
    <DatasetTreeItem
      nodeId={dataset.id}
      label={grouped ? dataset.name : dataset.typeName}
      icon={<Icon />}
    />
  )
}

const DatasetGroup: FC<{
  id: string
  datasets: PlateauDatasetFragment[]
}> = ({ id, datasets }) => {
  invariant(datasets.length > 0)
  if (datasets.length > 1) {
    return (
      <DatasetTreeItem key={id} nodeId={id} label={datasets[0].typeName}>
        {datasets.map(dataset => (
          <DatasetItem key={dataset.id} dataset={dataset} grouped />
        ))}
      </DatasetTreeItem>
    )
  }
  return <DatasetItem key={id} dataset={datasets[0]} />
}

const MunicipalityItem: FC<{ municipality: PlateauMunicipalityFragment }> = ({
  municipality
}) => {
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
      Object.entries(groupBy(query.data?.municipality?.datasets, 'type'))
        .map(([, value]) => value)
        .sort(
          (a, b) =>
            datasetTypeOrder.indexOf(a[0].type) -
            datasetTypeOrder.indexOf(b[0].type)
        )
        .map(value => ({
          id: value.map(({ id }) => id).join(':'),
          datasets: value
        })),
    [query.data?.municipality?.datasets]
  )
  return (
    <DatasetTreeItem nodeId={municipality.code} label={municipality.name}>
      {groups.map(({ id, datasets }) => (
        <DatasetGroup key={id} id={id} datasets={datasets} />
      ))}
    </DatasetTreeItem>
  )
}

const PrefectureItem: FC<{ prefecture: PlateauPrefectureFragment }> = ({
  prefecture
}) => {
  const query = usePrefectureMunicipalitiesQuery({
    variables: {
      prefectureCode: prefecture.code
    }
  })
  return (
    <DatasetTreeItem nodeId={prefecture.code} label={prefecture.name}>
      {query.data?.municipalities.map(municipality => (
        <MunicipalityItem key={municipality.code} municipality={municipality} />
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
      {query.data?.prefectures.map(prefecture => (
        <PrefectureItem key={prefecture.code} prefecture={prefecture} />
      ))}
    </DatasetTreeView>
  )
}
