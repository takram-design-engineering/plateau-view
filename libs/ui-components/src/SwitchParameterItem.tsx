import { styled, Switch, switchClasses, type SwitchProps } from '@mui/material'
import { atom, useAtom, type PrimitiveAtom, type SetStateAction } from 'jotai'
import {
  forwardRef,
  useCallback,
  useMemo,
  type ChangeEvent,
  type PropsWithoutRef
} from 'react'

import { ParameterItem, type ParameterItemProps } from './ParameterItem'

const StyledSwitch = styled(Switch, {
  shouldForwardProp: prop => prop !== 'indeterminate'
})<{
  indeterminate?: boolean
}>(({ theme, size = 'small', indeterminate = false }) => {
  return {
    marginRight: 0,
    ...(indeterminate && {
      [`& .${switchClasses.switchBase}`]: {
        transform: `translateX(${size === 'small' ? 6 : 7}px)`
      }
    })
  }
})

export interface SwitchParameterItemProps
  extends PropsWithoutRef<Omit<SwitchProps, 'value'>>,
    Pick<ParameterItemProps, 'label' | 'labelFontSize' | 'description'> {
  atom: PrimitiveAtom<boolean> | Array<PrimitiveAtom<boolean>>
}

const MIXED = 'MIXED'

export const SwitchParameterItem = forwardRef<
  HTMLDivElement,
  SwitchParameterItemProps
>(
  (
    {
      label,
      labelFontSize,
      description,
      atom: atomOrAtoms,
      onChange,
      ...props
    },
    ref
  ) => {
    const mergedAtom = useMemo(
      () =>
        Array.isArray(atomOrAtoms)
          ? atom(
              get => {
                if (atomOrAtoms.length === 0) {
                  return null
                }
                const values = atomOrAtoms.map(atom => get(atom))
                const [value] = values
                return values.slice(1).every(another => another === value)
                  ? value
                  : MIXED
              },
              (get, set, value: SetStateAction<boolean>) => {
                atomOrAtoms.forEach(atom => {
                  set(atom, value)
                })
              }
            )
          : atomOrAtoms,
      [atomOrAtoms]
    )
    const [checked, setChecked] = useAtom(mergedAtom)

    const handleChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setChecked(checked)
        onChange?.(event, checked)
      },
      [onChange, setChecked]
    )

    return (
      <ParameterItem
        ref={ref}
        label={label}
        labelFontSize={labelFontSize}
        description={description}
        control={
          <StyledSwitch
            {...props}
            checked={typeof checked === 'boolean' ? checked : false}
            indeterminate={checked === MIXED}
            onChange={handleChange}
          />
        }
        controlSpace='button'
      />
    )
  }
)
