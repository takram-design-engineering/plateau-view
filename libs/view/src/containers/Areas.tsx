import { useAtomValue, useSetAtom } from 'jotai'
import { type FC } from 'react'

import { AreaEntities } from '@plateau/data-sources'

import { areaDataSourceAtom, prefectureAtom } from '../states/address'
import { showMunicipalityEntitiesAtom } from '../states/app'

function getUrl(prefectureCode: string): string {
  return [
    process.env.NEXT_PUBLIC_DATA_BASE_URL,
    `areaPolygons/${prefectureCode}.topojson`
  ].join('/')
}

export const Areas: FC = () => {
  const prefecture = useAtomValue(prefectureAtom)

  // I really want to manage data sources in atoms but Cesiums' ownership
  // model is not too much to say broken, and we cannot prevent data sources
  // or related resources from being destroyed when DataSourceDisplay is
  // destroyed.
  const setDataSource = useSetAtom(areaDataSourceAtom)
  const show = useAtomValue(showMunicipalityEntitiesAtom)

  if (prefecture == null) {
    return null
  }
  return (
    <AreaEntities
      ref={setDataSource}
      url={getUrl(prefecture.code)}
      show={show}
    />
  )
}
