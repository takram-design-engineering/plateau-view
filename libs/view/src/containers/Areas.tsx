import { Color, Entity } from '@cesium/engine'
import { useTheme } from '@mui/material'
import { useAtom, useAtomValue } from 'jotai'
import { useMemo, type FC } from 'react'

import { AreaEntities } from '@takram/plateau-data-sources'
import {
  useScreenSpaceSelectionResponder,
  type ScreenSpaceSelectionEntry
} from '@takram/plateau-screen-space-selection'

import { areaDataSourceAtom, prefectureAtom } from '../states/address'
import { showAreaEntitiesAtom } from '../states/app'

export const AREA = 'AREA'

declare module '@takram/plateau-screen-space-selection' {
  interface ScreenSpaceSelectionOverrides {
    [AREA]: string
  }
}

export const Areas: FC = () => {
  const prefecture = useAtomValue(prefectureAtom)

  // I really want to manage data sources in atoms but Cesiums' ownership
  // model is not too much to say broken, and we cannot prevent data sources
  // or related resources from being destroyed when DataSourceDisplay is
  // destroyed.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [dataSource, setDataSource] = useAtom(areaDataSourceAtom)
  const show = useAtomValue(showAreaEntitiesAtom)

  // TODO: Make selectable
  useScreenSpaceSelectionResponder({
    type: AREA,
    transform: object => {
      if (!(object instanceof Entity) || !object.id.startsWith('AreaEntity:')) {
        return
      }
      return {
        type: AREA,
        value: object.id
      }
    },
    predicate: (value): value is ScreenSpaceSelectionEntry<typeof AREA> => {
      return value.type === AREA
    }
  })

  const theme = useTheme()
  const color = useMemo(
    () => Color.fromCssColorString(theme.palette.primary.main).withAlpha(0.5),
    [theme]
  )

  if (prefecture == null) {
    return null
  }
  return (
    <AreaEntities
      ref={setDataSource}
      url={`/assets/areaPolygons/${prefecture.code}.topojson`}
      color={color}
      show={show}
    />
  )
}
