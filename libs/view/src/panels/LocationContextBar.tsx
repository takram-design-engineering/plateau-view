import { styled } from '@mui/material'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FC
} from 'react'
import invariant from 'tiny-invariant'

import { ContextBar, type ContextBarProps } from '@takram/plateau-ui-components'

import { useLocationContextState } from '../hooks/useLocationContextState'
import { LocationBreadcrumbs } from './LocationBreadcrumbs'
import { BuildingDatasetButtonSelect } from './LocationContextBar/BuildingDatasetButtonSelect'
import { DefaultDatasetButton } from './LocationContextBar/DefaultDatasetButton'
import { DefaultDatasetSelect } from './LocationContextBar/DefaultDatasetSelect'

const Probe = styled('div')({
  position: 'absolute',
  inset: 0,
  height: 0
})

export const LocationContextBar: FC = () => {
  const {
    areas,
    datasetGroups,
    focusedAreaCode,
    focusArea,
    preventChanges,
    approveChanges
  } = useLocationContextState()

  const municipalityCode = useMemo(
    () =>
      focusedAreaCode ??
      areas?.find(({ type }) => type === 'municipality')?.code,
    [areas, focusedAreaCode]
  )

  const [expanded, setExpanded] = useState(false)
  const handleCollapse = useCallback(() => {
    setExpanded(false)
  }, [])
  const handleExpand = useCallback(() => {
    setExpanded(true)
  }, [])

  const [orientation, setOrientation] =
    useState<NonNullable<ContextBarProps['orientation']>>('horizontal')
  const probeRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const element = probeRef.current
    invariant(element != null)

    const observer = new ResizeObserver(([entry]) => {
      setOrientation(entry.contentRect.width > 500 ? 'horizontal' : 'vertical')
    })
    observer.observe(element)
    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <Probe ref={probeRef} />
      <ContextBar
        hidden={areas == null}
        orientation={orientation}
        expanded={expanded}
        onCollapse={handleCollapse}
        onExpand={handleExpand}
        onMouseEnter={preventChanges}
        onMouseLeave={approveChanges}
        startAdornment={
          areas != null && (
            <LocationBreadcrumbs
              areas={areas}
              focusedAreaCode={focusedAreaCode}
              focusArea={focusArea}
            />
          )
        }
      >
        {datasetGroups != null &&
          municipalityCode != null &&
          datasetGroups.map(datasets => {
            if (datasets.length > 1) {
              return (
                <DefaultDatasetSelect
                  key={datasets[0].id}
                  datasets={datasets}
                  municipalityCode={municipalityCode}
                />
              )
            }
            invariant(datasets.length === 1)
            const [dataset] = datasets
            return dataset.__typename === 'PlateauBuildingDataset' ? (
              <BuildingDatasetButtonSelect
                key={dataset.id}
                dataset={dataset}
                municipalityCode={municipalityCode}
              />
            ) : dataset.data.length === 1 ? (
              <DefaultDatasetButton
                key={dataset.id}
                dataset={dataset}
                municipalityCode={municipalityCode}
              />
            ) : (
              <DefaultDatasetSelect
                key={dataset.id}
                datasets={[dataset]}
                municipalityCode={municipalityCode}
              />
            )
          })}
      </ContextBar>
    </>
  )
}
