import { type SxProps, type Theme } from '@mui/material'

import { isNotNullish } from '@takram/plateau-type-helpers'

export function mergeSxProps(
  props: ReadonlyArray<SxProps<Theme> | undefined>
): SxProps<Theme> {
  return props.flat().filter(isNotNullish)
}
