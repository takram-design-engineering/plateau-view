import { definitions } from './definitions'
import { type MeshType } from './types'

const meshTypesByCodeLength: Record<number, MeshType | undefined> =
  Object.entries(definitions).reduce(
    (result, [type, { codeLength }]) => ({
      ...result,
      [codeLength]: type
    }),
    {}
  )

export function inferMeshType(code: string): MeshType | undefined {
  return meshTypesByCodeLength[code.length]
}
