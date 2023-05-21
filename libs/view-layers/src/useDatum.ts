import { useAtomValue, type Atom } from 'jotai'

import {
  type PlateauDatasetDatum,
  type PlateauDatasetFragment
} from '@takram/plateau-graphql'

export function useDatum(
  datumIdAtom: Atom<string | null>,
  datasets?: readonly PlateauDatasetFragment[]
): PlateauDatasetDatum | undefined {
  const datumId = useAtomValue(datumIdAtom)
  if (datumId == null) {
    return datasets?.[0]?.data[0]
  }
  return datasets
    ?.flatMap(({ data }): PlateauDatasetDatum[] => data)
    .find(datum => datum.id === datumId)
}
