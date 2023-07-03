import {
  Select,
  styled,
  type SelectChangeEvent,
  type SelectProps
} from '@mui/material'
import { atom, useAtom, type PrimitiveAtom, type SetStateAction } from 'jotai'
import {
  forwardRef,
  useCallback,
  useMemo,
  type PropsWithoutRef,
  type ReactNode
} from 'react'

import {
  colorSchemeCividis,
  colorSchemeCrest,
  colorSchemeFlare,
  colorSchemeIcefire,
  colorSchemeInferno,
  colorSchemeMagma,
  colorSchemeMako,
  colorSchemePlasma,
  colorSchemeRocket,
  colorSchemeTurbo,
  colorSchemeViridis,
  colorSchemeVlag,
  type ColorScheme
} from '@takram/plateau-color-schemes'

import { ColorSchemeSelectItemContent } from './ColorSchemeSelectItemContent'
import { ParameterItem, type ParameterItemProps } from './ParameterItem'
import { SelectItem } from './SelectItem'

const colorSchemes = [
  colorSchemeCividis,
  colorSchemeCrest,
  colorSchemeFlare,
  colorSchemeIcefire,
  colorSchemeInferno,
  colorSchemeMagma,
  colorSchemeMako,
  colorSchemePlasma,
  colorSchemeRocket,
  colorSchemeTurbo,
  colorSchemeViridis,
  colorSchemeVlag
]

const StyledSelect = styled(Select)(({ theme }) => ({
  width: `calc(100% - ${theme.spacing(-2)})`,
  marginLeft: theme.spacing(-1)
})) as unknown as typeof Select // For generics

const Value = styled('div')(({ theme }) => ({
  ...theme.typography.body2,
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis'
}))

export interface ColorSchemeParameterItemProps
  extends PropsWithoutRef<Omit<SelectProps<string | null>, 'value'>>,
    Pick<ParameterItemProps, 'label' | 'labelFontSize' | 'description'> {
  atom: PrimitiveAtom<ColorScheme> | Array<PrimitiveAtom<ColorScheme>>
}

const MIXED = 'MIXED'

export const ColorSchemeParameterItem = forwardRef<
  HTMLDivElement,
  ColorSchemeParameterItemProps
>(
  (
    {
      label,
      labelFontSize,
      description,
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
              (get, set, value: SetStateAction<ColorScheme>) => {
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
      (event: SelectChangeEvent<string | null>, child: ReactNode) => {
        const colorScheme = colorSchemes.find(
          ({ name }) => name === event.target.value
        )
        if (colorScheme == null) {
          return
        }
        setValue(colorScheme)
        onChange?.(event, child)
      },
      [onChange, setValue]
    )

    return (
      <ParameterItem
        ref={ref}
        label={label}
        labelFontSize={labelFontSize}
        description={description}
        gutterBottom
      >
        <StyledSelect
          variant='filled'
          fullWidth
          {...props}
          value={value !== null ? (value !== MIXED ? value.name : MIXED) : ''}
          onChange={handleChange}
        >
          {value === MIXED && (
            <SelectItem value={MIXED}>
              <Value>混在</Value>
            </SelectItem>
          )}
          {colorSchemes.map(colorScheme => (
            <SelectItem key={colorScheme.name} value={colorScheme.name}>
              <ColorSchemeSelectItemContent colorScheme={colorScheme} />
            </SelectItem>
          ))}
        </StyledSelect>
      </ParameterItem>
    )
  }
)
