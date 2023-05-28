import { useAtomValue, type Atom } from 'jotai'
import { useMemo } from 'react'

import {
  type PlateauDatasetDatumFragment,
  type PlateauDatasetFormat,
  type PlateauDatasetFragment
} from '@takram/plateau-graphql'

export type DatasetDatum<
  Format extends PlateauDatasetFormat = PlateauDatasetFormat
> = PlateauDatasetDatumFragment & {
  dataset: PlateauDatasetFragment
  format: Format
}

export function useDatasetDatum(
  datumIdAtom: Atom<string | null>,
  datasets?: readonly PlateauDatasetFragment[]
): DatasetDatum | undefined {
  const datumId = useAtomValue(datumIdAtom)
  return useMemo(() => {
    if (datumId == null) {
      const dataset = datasets?.[0]
      if (dataset == null) {
        return
      }
      const datum = dataset.data[0]
      return datum != null ? { ...datum, dataset } : undefined
    }
    const dataset = datasets?.find(({ data }) =>
      data.some(datum => datum.id === datumId)
    )
    if (dataset == null) {
      return
    }
    const datum = (dataset.data as PlateauDatasetDatumFragment[]).find(
      datum => datum.id === datumId
    )
    return datum != null ? { ...datum, dataset } : undefined
  }, [datasets, datumId])
}
