import { Stack, alpha, styled } from '@mui/material'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FC
} from 'react'
import invariant from 'tiny-invariant'

import { ContextBar } from '@takram/plateau-ui-components'

import { useLocationContextState } from '../hooks/useLocationContextState'
import { BuildingDatasetButtonSelect } from './LocationContextBar/BuildingDatasetButtonSelect'
import { DefaultDatasetButton } from './LocationContextBar/DefaultDatasetButton'
import { DefaultDatasetSelect } from './LocationContextBar/DefaultDatasetSelect'
import { LocationBreadcrumbs } from './LocationContextBar/LocationBreadcrumbs'

const Controls = styled('div')(({ theme }) => ({
  position: 'relative',
  '&:before': {
    content: '""',
    position: 'absolute',
    display: 'block',
    top: theme.spacing(-0.5),
    left: theme.spacing(-1),
    height: `calc(100% + ${theme.spacing(1)})`,
    // Match the light style of divider.
    // https://github.com/mui/material-ui/blob/v5.13.1/packages/mui-material/src/Divider/Divider.js#L71
    borderLeft: `solid 1px ${alpha(theme.palette.divider, 0.08)}`
  }
}))

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

  const [overflow, setOverflow] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const expandedRef = useRef(expanded)
  expandedRef.current = expanded

  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const container = containerRef.current
    const content = contentRef.current
    invariant(container != null)
    invariant(content != null)

    const intrinsicHeight = container.getBoundingClientRect().height
    // Initial test intentionally omitted.

    let containerRect: DOMRect | undefined
    let contentRect: DOMRect | undefined
    const observer = new ResizeObserver(entries => {
      entries.forEach(entry => {
        if (entry.target === container) {
          containerRect = entry.contentRect
        } else if (entry.target === content) {
          contentRect = entry.contentRect
        }
      })
      if (containerRect == null || contentRect == null) {
        return
      }
      if (!expandedRef.current) {
        setOverflow(containerRect.width < contentRect.width)
      } else {
        setOverflow(contentRect.height > intrinsicHeight)
      }
    })

    observer.observe(container)
    observer.observe(content)
    return () => {
      observer.disconnect()
    }
  }, [])

  const handleClickOverflow = useCallback(() => {
    setExpanded(value => !value)
  }, [])

  return (
    <ContextBar
      ref={containerRef}
      hidden={areas == null}
      overflow={overflow}
      expanded={expanded}
      onClickOverflow={handleClickOverflow}
      onMouseEnter={preventChanges}
      onMouseLeave={approveChanges}
    >
      <Stack ref={contentRef} direction='row' spacing={1.5}>
        {areas != null && (
          <LocationBreadcrumbs
            areas={areas}
            focusedAreaCode={focusedAreaCode}
            focusArea={focusArea}
          />
        )}
        {datasetGroups != null && municipalityCode != null && (
          <Controls>
            <Stack
              direction='row'
              spacing={0.5}
              useFlexGap
              rowGap={0.5}
              {...(expanded && {
                flexWrap: 'wrap'
              })}
            >
              {datasetGroups.map(datasets => {
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
            </Stack>
          </Controls>
        )}
      </Stack>
    </ContextBar>
  )
}
