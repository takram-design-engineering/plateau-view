import { isEqual, omit } from 'lodash'
import invariant from 'tiny-invariant'

import { isNotNullish } from '@plateau/type-helpers'

import { type PlateauCatalogData } from '../dto/PlateauCatalog'
import { type PlateauMunicipality } from '../dto/PlateauMunicipality'

export function getMunicipalitiesInCatalog(
  data: readonly PlateauCatalogData[]
): PlateauMunicipality[] {
  const municipalities = new Map<string, PlateauMunicipality>()
  data.forEach(entry => {
    if (entry.pref_code == null) {
      return
    }
    const [code, name] =
      'ward_code' in entry && entry.ward_code != null
        ? [entry.ward_code, entry.ward]
        : [entry.city_code, entry.city]
    if (code == null) {
      return
    }
    invariant(name != null, 'Missing name')

    const data: PlateauMunicipality = {
      type: 'municipality',
      code,
      name,
      parents: [
        entry.city_code !== code && entry.city_code != null
          ? ({
              type: 'municipality',
              code: entry.city_code
            } as const)
          : undefined,
        {
          type: 'prefecture',
          code: entry.pref_code
        } as const
      ].filter(isNotNullish)
    }
    if (!municipalities.has(data.code)) {
      municipalities.set(data.code, data)
      return
    }

    // Validate if every data is the same.
    const prevData = municipalities.get(data.code)
    invariant(prevData != null)
    if (isEqual(prevData, data)) {
      return
    }
    if (
      !isEqual(prevData.parents, data.parents) &&
      isEqual(omit(prevData, 'parents'), omit(data, 'parents'))
    ) {
      // Some entries inconsistently don't seem to have city codes. Take more
      // specific one for our parent code.
      if (data.parents.length > prevData.parents.length) {
        municipalities.set(prevData.code, {
          ...prevData,
          parents: data.parents
        })
      } else if (data.parents.length === prevData.parents.length) {
        municipalities.set(prevData.code, {
          ...prevData,
          parents: data.parents.map((parent, index) => {
            const prevParent = prevData.parents[index]
            invariant(parent.type === prevParent.type)
            return +parent.code > +prevParent.code ? parent : prevParent
          })
        })
      }
    } else {
      throw new Error(
        `Inconsistent municipality data: expected=${JSON.stringify(
          prevData
        )} actual=${JSON.stringify(data)}`
      )
    }
  })
  return Array.from(municipalities.values())
}
