import {
  Select,
  styled,
  type SelectChangeEvent,
  type SelectProps
} from '@mui/material'
import { useAtom, type PrimitiveAtom } from 'jotai'
import {
  forwardRef,
  useCallback,
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
  marginRight: theme.spacing(-1)
})) as unknown as typeof Select // For generics

export interface ColorSchemeParameterItemProps
  extends PropsWithoutRef<Omit<SelectProps<string | null>, 'value'>>,
    Pick<ParameterItemProps, 'label' | 'labelFontSize' | 'description'> {
  atom: PrimitiveAtom<ColorScheme | null>
}

export const ColorSchemeParameterItem = forwardRef<
  HTMLDivElement,
  ColorSchemeParameterItemProps
>(
  (
    { label, labelFontSize, description, atom, onChange, children, ...props },
    ref
  ) => {
    const [value, setValue] = useAtom(atom)

    const handleChange = useCallback(
      (event: SelectChangeEvent<string | null>, child: ReactNode) => {
        setValue(
          colorSchemes.find(({ name }) => name === event.target.value) ?? null
        )
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
          variant='outlined'
          fullWidth
          {...props}
          value={value !== null ? value.name : ''}
          onChange={handleChange}
          displayEmpty
        >
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
