import {
  Breadcrumbs,
  Button,
  Divider,
  Select,
  Stack,
  Typography,
  breadcrumbsClasses,
  buttonClasses,
  styled
} from '@mui/material'
import { useAtomValue } from 'jotai'
import { useCallback, type FC } from 'react'

import { useCesium } from '@plateau/cesium'
import { flyToPolygonEntity } from '@plateau/cesium-helpers'
import { AssetControl, ContextBar, SelectItem } from '@plateau/ui-components'

import {
  municipalityAddressAtom,
  municipalityDataSourceAtom
} from '../states/address'

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

const StyledSelect = styled(Select)({
  height: '100%',
  borderRadius: 0
})

export const LocationContextBar: FC = () => {
  const scene = useCesium(({ scene }) => scene, { indirect: true })
  const address = useAtomValue(municipalityAddressAtom)
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
    <ContextBar>
      <Stack direction='row' spacing={1} alignItems='center' height='100%'>
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
        <Divider orientation='vertical' light />
        <Stack direction='row' spacing={1} alignItems='center' height='100%'>
          <AssetControl active>建築物</AssetControl>
          <AssetControl>避難施設</AssetControl>
          <AssetControl>ランドマーク</AssetControl>
          <AssetControl>鉄道駅</AssetControl>
          <StyledSelect variant='filled' size='small' displayEmpty value=''>
            <SelectItem value=''>
              <Typography variant='body2'>ユースケース</Typography>
            </SelectItem>
          </StyledSelect>
        </Stack>
      </Stack>
    </ContextBar>
  )
}
