import { getWorker } from './getWorker'
import { type ParseCSVOptions, type ParseCSVResult } from './parseCSV'

export async function parseCSVAsync(
  data: string | readonly string[],
  options: ParseCSVOptions
): Promise<ParseCSVResult> {
  const worker = await getWorker()
  const result = await worker.parseCSV({ data, options })
  return {
    ...result,
    codes: new Float64Array(result.codes),
    values: new Float32Array(result.values)
  }
}
