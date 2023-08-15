import { definitions } from './definitions'
import { type MeshSize, type MeshType } from './types'

export function getMeshSize(meshType: MeshType): MeshSize {
  const definition = definitions[meshType]
  if (definition == null) {
    throw new Error(`Unsupported mesh type: ${meshType}`)
  }
  return {
    longitude: definition.longitude,
    latitude: definition.latitude
  }
}
