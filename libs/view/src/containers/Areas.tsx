import { Color, Entity } from '@cesium/engine'
import { useTheme } from '@mui/material'
import { useAtom, useAtomValue } from 'jotai'
import { useMemo, type FC } from 'react'

import { AreaEntities, type AreaEntity } from '@plateau/data-sources'
import { useScreenSpaceSelectionResponder } from '@plateau/screen-space-selection'

import { areaDataSourceAtom, prefectureAtom } from '../states/address'
import { showAreaEntitiesAtom } from '../states/app'

export const Areas: FC = () => {
  const prefecture = useAtomValue(prefectureAtom)

  // I really want to manage data sources in atoms but Cesiums' ownership
  // model is not too much to say broken, and we cannot prevent data sources
  // or related resources from being destroyed when DataSourceDisplay is
  // destroyed.
  const [dataSource, setDataSource] = useAtom(areaDataSourceAtom)
  const show = useAtomValue(showAreaEntitiesAtom)

  useScreenSpaceSelectionResponder({
    predicate: (object): object is AreaEntity => {
      return object instanceof Entity && object.id.startsWith('AreaEntity:')
    },
    onSelect: objects => {
      objects.forEach(object => {
        dataSource?.entities.add(object)
      })
    },
    onDeselect: objects => {
      objects.forEach(object => {
        dataSource?.entities.remove(object)
      })
    },
    computeBoundingSphere: (object, result) => {
      return object.boundingSphere.clone(result)
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
