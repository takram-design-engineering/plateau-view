import { atom, type SetStateAction } from 'jotai'

import { type AreaDataSource } from '@plateau/data-sources'
import type { Area, PrefectureArea } from '@plateau/geocoder'

import { type ReverseGeocoderResult } from '../hooks/useReverseGeocoder'

const addressPrimitiveAtom = atom<ReverseGeocoderResult | null>(null)
export const addressAtom = atom(
  get => get(addressPrimitiveAtom),
  (get, set, value: SetStateAction<ReverseGeocoderResult | null>) => {
    set(addressPrimitiveAtom, value)

    // Propagate changes to municipality and prefecture.
    const address = get(addressPrimitiveAtom)
    set(areasPrimitiveAtom, prevValue =>
      address != null
        ? address.areas[0].code !== prevValue?.[0].code
          ? address.areas
          : prevValue
        : null
    )
    set(prefecturePrimitiveAtom, prevValue =>
      address != null
        ? address.areas[address.areas.length - 1].code !== prevValue?.code
          ? address.areas.find(
              (area: Area): area is PrefectureArea => area.type === 'prefecture'
            ) ?? null
          : prevValue
        : null
    )

    // I really want to manage data sources in atoms but Cesiums' ownership
    // model is not too much to say broken, and we cannot prevent data sources
    // or related resources from being destroyed when DataSourceDisplay is
    // destroyed.
  }
)

const areasPrimitiveAtom = atom<Area[] | null>(null)
export const areasAtom = atom(get => get(areasPrimitiveAtom))

const prefecturePrimitiveAtom = atom<PrefectureArea | null>(null)
export const prefectureAtom = atom(get => get(prefecturePrimitiveAtom))

export const areaDataSourceAtom = atom<AreaDataSource | null>(null)
