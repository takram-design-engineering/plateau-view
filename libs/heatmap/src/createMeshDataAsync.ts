import { Transfer } from 'threads'

import { type MeshData, type MeshDataInput } from './createMeshData'
import { getWorker } from './getWorker'

export async function createMeshDataAsync(
  input: MeshDataInput
): Promise<MeshData> {
  const worker = await getWorker()
  const codes = input.codes.buffer
  const values = input.values.buffer
  const result = await worker.createMeshData(
    Transfer({ ...input, codes, values }, [codes, values])
  )
  return {
    ...result,
    data: new Uint8ClampedArray(result.data)
  }
}
