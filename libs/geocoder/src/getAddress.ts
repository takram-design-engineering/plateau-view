import axios, { CanceledError } from 'axios'

import { getAreas, type Area } from './getAreas'

export interface Coords {
  longitude: number
  latitude: number
}

export interface AddressOptions<R extends boolean = boolean> {
  includeRadii?: R
  signal?: AbortSignal
}

export interface Address<R extends boolean = boolean> {
  areas: Array<Area<R>>
  address?: string
}

export function getAddress<R extends boolean = boolean>(
  coords: Coords,
  options: AddressOptions<R>
): Promise<Address<R> | undefined>

export async function getAddress(
  { longitude, latitude }: Coords,
  { includeRadii = false, signal }: AddressOptions = {}
): Promise<Address | undefined> {
  try {
    const { data } = await axios.get(
      'https://mreversegeocoder.gsi.go.jp/reverse-geocoder/LonLatToAddress',
      {
        params: {
          lon: longitude,
          lat: latitude
        },
        signal
      }
    )
    const municipalityCode = data.results?.muniCd
    const name = data.results?.lv01Nm
    if (typeof municipalityCode !== 'string' || typeof name !== 'string') {
      return undefined
    }
    const areas = await getAreas(municipalityCode, includeRadii)
    if (areas == null) {
      return undefined
    }
    return {
      areas,
      // Empty value is denoted by "－".
      address: name !== '－' ? name.replace('　', ' ') : undefined
    }
  } catch (error) {
    if (error instanceof CanceledError) {
      return undefined
    }
    throw error
  }
}
