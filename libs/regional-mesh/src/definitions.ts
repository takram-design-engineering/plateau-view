import { type MeshType } from './types'

interface Definition {
  parentType?: MeshType
  codeLength: number
  longitude: number
  latitude: number
}

export const definitions: Record<MeshType, Definition> = {
  primary: {
    codeLength: 4,
    longitude: 1,
    latitude: 40 / 60
  },
  secondary: {
    parentType: 'primary',
    codeLength: 6,
    longitude: 7.5 / 60,
    latitude: 5 / 60
  },
  tertiary: {
    parentType: 'secondary',
    codeLength: 8,
    longitude: 45 / 3600,
    latitude: 30 / 3600
  },
  half: {
    parentType: 'tertiary',
    codeLength: 9,
    longitude: 22.5 / 3600,
    latitude: 15 / 3600
  },
  quarter: {
    parentType: 'half',
    codeLength: 10,
    longitude: 11.25 / 3600,
    latitude: 7.5 / 3600
  },
  eighth: {
    parentType: 'quarter',
    codeLength: 11,
    longitude: 5.625 / 3600,
    latitude: 3.75 / 3600
  }
}
