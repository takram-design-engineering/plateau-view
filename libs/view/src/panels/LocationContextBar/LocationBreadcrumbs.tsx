import {
  Breadcrumbs,
  Button,
  breadcrumbsClasses,
  buttonClasses,
  styled
} from '@mui/material'
import { useAtomValue, useSetAtom } from 'jotai'
import { useCallback, type FC, type MouseEvent } from 'react'

import { useCesium } from '@takram/plateau-cesium'
import { flyToArea } from '@takram/plateau-data-sources'
import { screenSpaceSelectionAtom } from '@takram/plateau-screen-space-selection'

import { type LocationContextState } from '../../hooks/useLocationContextState'
import { areaDataSourceAtom } from '../../states/address'

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  ...theme.typography.body2,
  margin: `0 ${theme.spacing(1)}`,
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: 'baseline',
    flexWrap: 'nowrap'
  },
  [`& .${breadcrumbsClasses.separator}`]: {
    margin: `0 ${theme.spacing(0.5)}`
  },
  [`& .${buttonClasses.text}`]: {
    minWidth: 0
  }
}))

export interface LocationBreadcrumbsProps
  extends Pick<
    LocationContextState,
    'areas' | 'focusedAreaCode' | 'focusArea'
  > {}

export const LocationBreadcrumbs: FC<LocationBreadcrumbsProps> = ({
  areas,
  focusedAreaCode,
  focusArea
}) => {
  const scene = useCesium(({ scene }) => scene, { indirect: true })
  const dataSource = useAtomValue(areaDataSourceAtom)

  const replace = useSetAtom(screenSpaceSelectionAtom)

  // TODO: Handle in atoms and make them declarative.
  const handleClick = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (areas == null) {
        return
      }
      const reverseIndex = event.currentTarget.dataset.reverseIndex
      if (reverseIndex == null) {
        return
      }
      const area = areas[areas.length - 1 - +reverseIndex]
      if (
        (focusedAreaCode != null && area.code !== focusedAreaCode) ||
        (focusedAreaCode == null && +reverseIndex !== areas.length - 1)
      ) {
        focusArea(area.code)
        return
      }
      if (dataSource == null || scene == null) {
        return
      }
      const entities = dataSource.getEntities(area.code)
      if (entities != null) {
        replace(entities)
        void flyToArea(scene, dataSource, area.code)
      }
    },
    [areas, focusedAreaCode, focusArea, scene, dataSource, replace]
  )

  if (areas == null) {
    return null
  }
  return (
    <StyledBreadcrumbs separator='›'>
      {[...areas].reverse().map((area, index, { length }) => (
        <Button
          key={area.code}
          variant='text'
          size='small'
          color={
            focusedAreaCode != null
              ? area.code === focusedAreaCode
                ? 'primary'
                : 'inherit'
              : index === length - 1
              ? 'primary'
              : 'inherit'
          }
          fullWidth
          // selected={focusedArea != null && area.code === focusedArea.code}
          onClick={handleClick}
          data-reverse-index={index}
        >
          {area.name}
        </Button>
      ))}
    </StyledBreadcrumbs>
  )
}
