import axios, { CanceledError } from 'axios'

import { getMunicipality } from './getMunicipality'

export interface Coords {
  longitude: number
  latitude: number
}

export interface GetAddressOptions {
  signal?: AbortSignal
}

export interface Address {
  prefectureCode: string
  prefectureName: string
  municipalityCode: string
  municipalityName: string
  name?: string
}

export async function getAddress(
  { longitude, latitude }: Coords,
  { signal }: GetAddressOptions = {}
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
    const municipality = await getMunicipality(municipalityCode)
    if (municipality == null) {
      return undefined
    }
    return {
      ...municipality,
      // Empty value is denoted by "－".
      name: name !== '－' ? name.replace('　', ' ') : undefined
    }
  } catch (error) {
    if (error instanceof CanceledError) {
      return undefined
    }
    throw error
  }
}
