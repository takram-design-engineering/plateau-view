import { useAtomValue, useSetAtom } from 'jotai'
import { type FC } from 'react'

import { MunicipalityEntities } from '@plateau/data-sources'

import {
  municipalityDataSourceAtom,
  prefectureAddressAtom
} from '../states/address'
import { showMunicipalityEntitiesAtom } from '../states/app'

function getUrl(prefectureCode: string): string {
  return [
    process.env.NEXT_PUBLIC_DATA_BASE_URL,
    `estat/A002005212015DDSWC${prefectureCode}-JGD2011`,
    `h27ka${prefectureCode}.topojson`
  ].join('/')
}

export const Municipalities: FC = () => {
  const prefecture = useAtomValue(prefectureAddressAtom)

  // I really want to manage data sources in atoms but Cesiums' ownership
  // model is not too much to say broken, and we cannot prevent data sources
  // or related resources from being destroyed when DataSourceDisplay is
  // destroyed.
  const setDataSource = useSetAtom(municipalityDataSourceAtom)
  const show = useAtomValue(showMunicipalityEntitiesAtom)

  if (prefecture == null) {
    return null
  }
  return (
    <MunicipalityEntities
      ref={setDataSource}
      url={getUrl(prefecture.prefectureCode)}
      show={show}
    />
  )
}
