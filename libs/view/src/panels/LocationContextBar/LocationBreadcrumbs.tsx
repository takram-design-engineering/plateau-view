import {
  Breadcrumbs,
  Button,
  breadcrumbsClasses,
  buttonClasses,
  styled
} from '@mui/material'
import { useAtomValue, useSetAtom } from 'jotai'
import { useCallback, useContext, type FC, type MouseEvent } from 'react'

import { useCesium } from '@plateau/cesium'
import type { Area } from '@plateau/geocoder'
import { ScreenSpaceSelectionContext } from '@plateau/screen-space-selection'

import { flyToArea } from '../../helpers/flyToArea'
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

export interface LocationBreadcrumbsProps {
  areas?: readonly Area[]
}

export const LocationBreadcrumbs: FC<LocationBreadcrumbsProps> = ({
  areas
}) => {
  const scene = useCesium(({ scene }) => scene, { indirect: true })
  const dataSource = useAtomValue(areaDataSourceAtom)

  const { replaceAtom } = useContext(ScreenSpaceSelectionContext)
  const replace = useSetAtom(replaceAtom)

  // TODO: Handle in atoms and make them declarative.
  const handleClick = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (areas == null || dataSource == null || scene == null) {
        return
      }
      const reverseIndex = event.currentTarget.dataset.reverseIndex
      if (reverseIndex == null) {
        return
      }
      const area = areas[areas.length - 1 - +reverseIndex]
      const entities = dataSource.getEntities(area.code)
      if (entities != null) {
        replace(entities)
        void flyToArea(scene, dataSource, area.code)
      }
    },
    [areas, scene, dataSource, replace]
  )

  if (areas == null) {
    return null
  }
  return (
    <StyledBreadcrumbs separator='›'>
      {[...areas].reverse().map((area, index) => (
        <Button
          key={area.code}
          variant='text'
          size='small'
          color='inherit'
          fullWidth
          onClick={handleClick}
          data-reverse-index={index}
        >
          {area.name}
        </Button>
      ))}
    </StyledBreadcrumbs>
  )
}
