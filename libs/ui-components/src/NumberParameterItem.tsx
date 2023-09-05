import {
  filledInputClasses,
  inputBaseClasses,
  styled,
  TextField,
  type TextFieldProps
} from '@mui/material'
import { atom, useAtom, type PrimitiveAtom, type SetStateAction } from 'jotai'
import {
  forwardRef,
  useCallback,
  useMemo,
  useRef,
  type ChangeEvent,
  type PropsWithoutRef,
  type ReactNode
} from 'react'

import { ParameterItem, type ParameterItemProps } from './ParameterItem'

const StyledTextField = styled(TextField)(({ theme }) => ({
  width: '8em',
  [`& .${filledInputClasses.root}`]: {
    ...theme.typography.body2,
    alignItems: 'baseline',
    color: theme.palette.text.secondary,
    backgroundColor: 'transparent',
    [`& .${inputBaseClasses.input}`]: {
      ...theme.typography.body2,
      paddingRight: theme.spacing(1),
      paddingLeft: theme.spacing(1),
      color: theme.palette.text.primary,
      textAlign: 'right',
      fontVariantNumeric: 'tabular-nums'
    },
    [`& .${filledInputClasses.inputAdornedEnd}`]: {
      ...theme.typography.body2
    }
  }
}))

export type NumberParameterItemProps = PropsWithoutRef<
  Omit<TextFieldProps, 'value'>
> &
  Pick<ParameterItemProps, 'label' | 'labelFontSize' | 'description'> & {
    unit?: ReactNode
    atom: PrimitiveAtom<number> | Array<PrimitiveAtom<number>>
  }

const MIXED = 'MIXED'

export const NumberParameterItem = forwardRef<
  HTMLDivElement,
  NumberParameterItemProps
>(
  (
    {
      label,
      labelFontSize,
      description,
      unit,
      atom: atomOrAtoms,
      onChange,
      children,
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
              (get, set, value: SetStateAction<number>) => {
                atomOrAtoms.forEach(atom => {
                  set(atom, value)
                })
              }
            )
          : atomOrAtoms,
      [atomOrAtoms]
    )
    const [value, setValue] = useAtom(mergedAtom)

    const handleChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        const value = +event.target.value
        if (!isNaN(value)) {
          setValue(value)
          onChange?.(event)
        }
      },
      [onChange, setValue]
    )

    const inputRef = useRef<HTMLInputElement>(null)
    const handleFocus = useCallback(() => {
      inputRef.current?.select()
    }, [])

    return (
      <ParameterItem
        ref={ref}
        label={label}
        labelFontSize={labelFontSize}
        description={description}
        control={
          <StyledTextField
            inputRef={inputRef}
            size='small'
            value={value === MIXED ? '混在' : value}
            onChange={handleChange}
            onFocus={handleFocus}
            InputProps={{
              ...props.InputProps,
              endAdornment: unit
            }}
            {...props}
          />
        }
        controlSpace='button'
      />
    )
  }
)
