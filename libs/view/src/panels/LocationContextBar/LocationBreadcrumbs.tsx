import {
  Breadcrumbs,
  Button,
  breadcrumbsClasses,
  buttonClasses,
  styled
} from '@mui/material'
import { useAtomValue } from 'jotai'
import { useCallback, type FC } from 'react'

import { useCesium } from '@plateau/cesium'
import { flyToPolygonEntity } from '@plateau/cesium-helpers'
import { type Address } from '@plateau/gsi-geocoder'

import { municipalityDataSourceAtom } from '../../states/address'

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
  address?: Address
}

export const LocationBreadcrumbs: FC<LocationBreadcrumbsProps> = ({
  address
}) => {
  const scene = useCesium(({ scene }) => scene, { indirect: true })
  const dataSource = useAtomValue(municipalityDataSourceAtom)

  // TODO: Handle in atoms and make them declarative.
  const handlePrefecture = useCallback(() => {
    if (address == null || dataSource == null || scene == null) {
      return
    }
    flyToPolygonEntity(scene, dataSource.entities.values).catch(error => {
      console.error(error)
    })
  }, [address, dataSource, scene])

  const handleMunicipality = useCallback(() => {
    if (address == null || dataSource == null || scene == null) {
      return
    }
    const entities = dataSource.findEntities(address.municipalityCode)
    if (entities != null) {
      flyToPolygonEntity(scene, entities).catch(error => {
        console.error(error)
      })
    }
  }, [address, dataSource, scene])

  if (address == null) {
    return null
  }
  return (
    <StyledBreadcrumbs separator='›'>
      <Button
        variant='text'
        size='small'
        color='inherit'
        fullWidth
        onClick={handlePrefecture}
      >
        {address.prefectureName}
      </Button>
      <Button
        variant='text'
        size='small'
        color='inherit'
        onClick={handleMunicipality}
      >
        {address.municipalityName}
      </Button>
    </StyledBreadcrumbs>
  )
}
