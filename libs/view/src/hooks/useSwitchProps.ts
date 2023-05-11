import { useAtom, type PrimitiveAtom } from 'jotai'
import { useCallback } from 'react'

export function useSwitchProps(atom: PrimitiveAtom<boolean>): {
  checked: boolean
  onChange: (event: unknown, checked: boolean) => void
} {
  const [value, set] = useAtom(atom)
  const handleChange = useCallback(
    (event: unknown, checked: boolean) => {
      set(checked)
    },
    [set]
  )
  return {
    checked: value,
    onChange: handleChange
  }
}
