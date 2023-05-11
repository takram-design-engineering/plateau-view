import { atom, type SetStateAction } from 'jotai'
import { omit, pick } from 'lodash'

import { type MunicipalityDataSource } from '@plateau/data-sources'

import { type ReverseGeocoderResult } from '../hooks/useReverseGeocoder'

export const addressPrimitiveAtom = atom<ReverseGeocoderResult | null>(null)
export const addressAtom = atom(
  get => get(addressPrimitiveAtom),
  (get, set, value: SetStateAction<ReverseGeocoderResult | null>) => {
    set(addressPrimitiveAtom, value)

    // Propagate changes to municipality and prefecture.
    const address = get(addressPrimitiveAtom)
    set(municipalityAddressPrimitiveAtom, prevValue =>
      address?.municipalityCode !== prevValue?.municipalityCode
        ? address != null
          ? omit(address, 'name')
          : address
        : prevValue
    )
    set(prefectureAddressPrimitiveAtom, prevValue =>
      address?.prefectureCode !== prevValue?.prefectureCode
        ? address != null
          ? pick(address, ['prefectureCode', 'prefectureName'])
          : address
        : prevValue
    )

    // I really want to manage data sources in atoms but Cesiums' ownership
    // model is not too much to say broken, and we cannot prevent data sources
    // or related resources from being destroyed when DataSourceDisplay is
    // destroyed.
  }
)

export const municipalityAddressPrimitiveAtom =
  atom<ReverseGeocoderResult<'municipality'> | null>(null)
export const municipalityAddressAtom = atom(get =>
  get(municipalityAddressPrimitiveAtom)
)

export const prefectureAddressPrimitiveAtom =
  atom<ReverseGeocoderResult<'prefecture'> | null>(null)
export const prefectureAddressAtom = atom(get =>
  get(prefectureAddressPrimitiveAtom)
)

export const municipalityDataSourceAtom = atom<MunicipalityDataSource | null>(
  null
)
