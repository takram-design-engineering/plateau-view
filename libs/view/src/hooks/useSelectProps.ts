import { type SelectChangeEvent } from '@mui/material'
import { useAtom, type PrimitiveAtom } from 'jotai'
import { useCallback } from 'react'
import invariant from 'tiny-invariant'

export function useNumberSelectProps<
  AllowNull extends boolean = true,
  T = AllowNull extends false ? number : number | null
>(
  atom: PrimitiveAtom<T>,
  allowNull?: AllowNull
): {
  value: string
  onChange: (event: SelectChangeEvent) => void
} {
  const [value, set] = useAtom(atom)
  const handleChange = useCallback(
    (event: SelectChangeEvent) => {
      const value = event.target.value === '' ? null : +event.target.value
      invariant(allowNull !== false || value != null)
      set(value as T)
    },
    [set, allowNull]
  )
  return {
    value: value != null ? `${value}` : '',
    onChange: handleChange
  }
}

export function useStringSelectProps<
  AllowNull extends boolean = true,
  T = AllowNull extends false ? string : string | null
>(
  atom: PrimitiveAtom<T>,
  allowNull?: AllowNull
): {
  value: string
  onChange: (event: SelectChangeEvent) => void
} {
  const [value, set] = useAtom(atom)
  const handleChange = useCallback(
    (event: SelectChangeEvent) => {
      const value = event.target.value === '' ? null : event.target.value
      invariant(allowNull !== false || value != null)
      set(value as T)
    },
    [set, allowNull]
  )
  return {
    value: value != null ? `${value}` : '',
    onChange: handleChange
  }
}
