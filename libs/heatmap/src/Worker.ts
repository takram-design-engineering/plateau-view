import { type TransferDescriptor } from 'threads'
import { expose, Transfer } from 'threads/worker'

import {
  createMeshData,
  type MeshData,
  type MeshDataInput
} from './createMeshData'
import { parseCSV, type ParseCSVOptions, type ParseCSVResult } from './parseCSV'

export interface WorkerParseCSVParams {
  data: string | readonly string[]
  options: ParseCSVOptions
}

export interface WorkerParseCSVResult
  extends Omit<ParseCSVResult, 'codes' | 'values'> {
  codes: ArrayBuffer
  values: ArrayBuffer
}

export interface WorkerCreateMeshDataParams
  extends Omit<MeshDataInput, 'codes' | 'values'> {
  codes: ArrayBuffer
  values: ArrayBuffer
}

export interface WorkerCreateMeshDataResult extends Omit<MeshData, 'data'> {
  data: ArrayBuffer
}

expose({
  parseCSV: ({
    data,
    options
  }: WorkerParseCSVParams): TransferDescriptor<WorkerParseCSVResult> => {
    const result = parseCSV(data, options)
    const codes = result.codes.buffer
    const values = result.values.buffer
    return Transfer({ ...result, codes, values }, [codes, values])
  },

  createMeshData: (
    params: WorkerCreateMeshDataParams
  ): TransferDescriptor<WorkerCreateMeshDataResult> => {
    const result = createMeshData({
      ...params,
      codes: new Float64Array(params.codes),
      values: new Float32Array(params.values)
    })
    const data = result.data.buffer
    return Transfer({ ...result, data }, [data])
  }
})

export type Worker = object & {
  parseCSV: (params: WorkerParseCSVParams) => WorkerParseCSVResult
  createMeshData: (
    params: TransferDescriptor<WorkerCreateMeshDataParams>
  ) => WorkerCreateMeshDataResult
}
