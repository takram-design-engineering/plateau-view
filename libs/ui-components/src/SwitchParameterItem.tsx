import { styled, Switch, type SwitchProps } from '@mui/material'
import { useAtom, type PrimitiveAtom } from 'jotai'
import {
  forwardRef,
  useCallback,
  type ChangeEvent,
  type PropsWithoutRef
} from 'react'

import { ParameterItem, type ParameterItemProps } from './ParameterItem'

const StyledSwitch = styled(Switch)(({ theme }) => ({
  marginRight: theme.spacing(-1)
}))

export interface SwitchParameterItemProps
  extends PropsWithoutRef<Omit<SwitchProps, 'value'>>,
    Pick<ParameterItemProps, 'label' | 'labelFontSize' | 'description'> {
  atom: PrimitiveAtom<boolean>
}

export const SwitchParameterItem = forwardRef<
  HTMLDivElement,
  SwitchParameterItemProps
>(({ label, labelFontSize, description, atom, onChange, ...props }, ref) => {
  const [checked, setChecked] = useAtom(atom)

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
        <StyledSwitch {...props} checked={checked} onChange={handleChange} />
      }
    />
  )
})
