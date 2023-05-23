import { useMemo } from 'react'
import invariant from 'tiny-invariant'

import {
  PlateauAreaType,
  type PlateauMunicipalityFragment
} from '@takram/plateau-graphql'

export function useMunicipalityName(
  municipality?: PlateauMunicipalityFragment | null
): string | undefined {
  return useMemo(() => {
    if (municipality == null) {
      return
    }
    const root = municipality.parents[municipality.parents.length - 1]
    if (root == null) {
      return municipality.name
    }
    invariant(root.type === PlateauAreaType.Prefecture)
    if (municipality.parents.length === 1) {
      return [root.name, municipality.name].join(' ')
    }
    invariant(municipality.parents.length === 2)
    const city = municipality.parents[0]
    return city.name.endsWith('23区')
      ? // Tokyo special wards are usually spelled with the prefecture name.
        `${root.name} ${municipality.name}`
      : // Omit the prefecture name because few cities have wards inside, and
        // it's obvious from the city name.
        `${city.name} ${municipality.name}`
  }, [municipality])
}
