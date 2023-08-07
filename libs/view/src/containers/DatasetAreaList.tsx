import { styled } from '@mui/material'
import { useAtom } from 'jotai'
import { atomWithReset } from 'jotai/utils'
import { groupBy } from 'lodash'
import { useCallback, useMemo, type FC, type ReactNode } from 'react'
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

const Delimiter = styled('span')(({ theme }) => ({
  margin: `0 0.5em`,
  color: theme.palette.text.disabled
}))

function joinPath(values: string[]): ReactNode {
  return (values as ReactNode[]).reduce((prev, curr) => [
    prev,
    <Delimiter>/</Delimiter>,
    curr
  ])
}

const DatasetItem: FC<{
  dataset: PlateauDatasetFragment
  parents?: string[]
  grouped?: boolean
}> = ({ dataset, parents = [], grouped = false }) => {
  const Icon = datasetTypeIcons[dataset.type]
  return (
    <DatasetTreeItem
      nodeId={dataset.id}
      label={joinPath([...parents, grouped ? dataset.name : dataset.typeName])}
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
              id: value.map(({ id }) => id).join(':'),
              datasets: value
            }))
        : undefined,
    [query.data?.municipality?.datasets]
  )
  if (query.data?.municipality?.datasets.length === 1) {
    return (
      <DatasetItem
        dataset={query.data.municipality.datasets[0]}
        parents={[...parents, municipality.name]}
      />
    )
  }
  return (
    <DatasetTreeItem
      nodeId={municipality.code}
      label={joinPath([...parents, municipality.name])}
    >
      {groups?.map(({ id, datasets }) => (
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
  if (query.data?.municipalities.length === 1) {
    return (
      <MunicipalityItem
        municipality={query.data.municipalities[0]}
        parents={[prefecture.name]}
      />
    )
  }
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
