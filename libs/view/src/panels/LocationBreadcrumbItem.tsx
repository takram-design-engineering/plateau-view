import { groupBy } from 'lodash'
import {
  bindPopover,
  bindTrigger,
  usePopupState
} from 'material-ui-popup-state/hooks'
import {
  useCallback,
  useId,
  useMemo,
  useState,
  type FC,
  type MouseEvent
} from 'react'
import invariant from 'tiny-invariant'

import type { Area } from '@takram/plateau-geocoder'
import {
  PlateauDatasetType,
  useMunicipalityDatasetsQuery
} from '@takram/plateau-graphql'
import { isNotNullish } from '@takram/plateau-type-helpers'
import {
  AppBreadcrumbsItem,
  ContextBar,
  OverlayPopper
} from '@takram/plateau-ui-components'

import { BuildingDatasetButtonSelect } from './LocationContextBar/BuildingDatasetButtonSelect'
import { DefaultDatasetButton } from './LocationContextBar/DefaultDatasetButton'
import { DefaultDatasetSelect } from './LocationContextBar/DefaultDatasetSelect'

const datasetTypeOrder = [
  PlateauDatasetType.Building,
  PlateauDatasetType.Bridge,
  PlateauDatasetType.Border,
  PlateauDatasetType.Landmark,
  PlateauDatasetType.Station,
  PlateauDatasetType.Road,
  PlateauDatasetType.Railway,
  PlateauDatasetType.Park,
  PlateauDatasetType.LandUse,
  PlateauDatasetType.RiverFloodingRisk,
  PlateauDatasetType.InlandFloodingRisk,
  PlateauDatasetType.HighTideRisk,
  PlateauDatasetType.LandSlideRisk,
  PlateauDatasetType.TsunamiRisk,
  PlateauDatasetType.Shelter,
  PlateauDatasetType.EmergencyRoute,
  PlateauDatasetType.UrbanPlanning,
  PlateauDatasetType.CityFurniture,
  PlateauDatasetType.Vegetation
]

export interface LocationBreadcrumbItemProps {
  area: Area
}

export const LocationBreadcrumbItem: FC<LocationBreadcrumbItemProps> = ({
  area
}) => {
  const query = useMunicipalityDatasetsQuery({
    variables: {
      municipalityCode: area.code,
      excludeTypes: [
        PlateauDatasetType.UseCase,
        PlateauDatasetType.GenericCityObject
      ]
    }
  })

  const datasetGroups = useMemo(() => {
    const datasets = query.data?.municipality?.datasets
    if (datasets == null) {
      return
    }
    const groups = Object.entries(groupBy(datasets, 'type'))
    return datasetTypeOrder
      .map(orderedType => groups.find(([type]) => type === orderedType))
      .filter(isNotNullish)
      .map(([, datasets]) => datasets)
  }, [query.data])

  const [expanded, setExpanded] = useState(false)
  const handleCollapse = useCallback(() => {
    setExpanded(false)
  }, [])
  const handleExpand = useCallback(() => {
    setExpanded(true)
  }, [])

  const id = useId()
  const popupState = usePopupState({
    variant: 'popover',
    popupId: id
  })
  const popoverProps = bindPopover(popupState)
  const triggerProps = bindTrigger(popupState)
  const { open, onClose } = popoverProps
  const { close } = popupState
  const { onClick } = triggerProps

  const handleClick = useCallback(
    (event: MouseEvent) => {
      if (open) {
        close()
      } else {
        onClick(event)
      }
    },
    [open, close, onClick]
  )
  const handleClose = useCallback(() => {
    onClose()
    setExpanded(false)
  }, [onClose])

  const hasDatasets = datasetGroups != null && datasetGroups.length > 0
  return (
    <>
      <AppBreadcrumbsItem
        dropDown={hasDatasets}
        disabled={!hasDatasets}
        {...triggerProps}
        onClick={handleClick}
      >
        {area.name}
      </AppBreadcrumbsItem>
      {hasDatasets && (
        <OverlayPopper {...popoverProps} inset={1.5} onClose={handleClose}>
          <ContextBar
            expanded={expanded}
            onCollapse={handleCollapse}
            onExpand={handleExpand}
          >
            {datasetGroups.map(datasets => {
              if (datasets.length > 1) {
                return (
                  <DefaultDatasetSelect
                    key={datasets[0].id}
                    datasets={datasets}
                    municipalityCode={area.code}
                  />
                )
              }
              invariant(datasets.length === 1)
              const [dataset] = datasets
              return dataset.__typename === 'PlateauBuildingDataset' ? (
                <BuildingDatasetButtonSelect
                  key={dataset.id}
                  dataset={dataset}
                  municipalityCode={area.code}
                />
              ) : dataset.data.length === 1 ? (
                <DefaultDatasetButton
                  key={dataset.id}
                  dataset={dataset}
                  municipalityCode={area.code}
                />
              ) : (
                <DefaultDatasetSelect
                  key={dataset.id}
                  datasets={[dataset]}
                  municipalityCode={area.code}
                />
              )
            })}
          </ContextBar>
        </OverlayPopper>
      )}
    </>
  )
}
