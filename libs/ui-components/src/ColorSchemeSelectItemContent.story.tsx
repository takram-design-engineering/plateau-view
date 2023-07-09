import { Select, type SelectChangeEvent } from '@mui/material'
import { type Meta, type StoryObj } from '@storybook/react'
import { useState, type FC } from 'react'

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
  colorSchemeVlag
} from '@takram/plateau-color-schemes'

import { ColorSchemeSelectItemContent } from './ColorSchemeSelectItemContent'
import { SelectItem } from './SelectItem'

const meta: Meta<typeof ColorSchemeSelectItemContent> = {
  title: 'ColorSchemeSelectItemContent',
  component: ColorSchemeSelectItemContent
}

export default meta

type Story = StoryObj<typeof ColorSchemeSelectItemContent>

const Component: FC = () => {
  const [value, setValue] = useState('')
  const handleChange = <T,>(event: SelectChangeEvent<T>): void => {
    console.log(event)
    if (typeof event.target.value === 'string') {
      setValue(event.target.value)
    }
  }

  return (
    <Select variant='filled' size='small' value={value} onChange={handleChange}>
      <SelectItem value={colorSchemeCividis.name}>
        <ColorSchemeSelectItemContent colorScheme={colorSchemeCividis} />
      </SelectItem>
      <SelectItem value={colorSchemeCrest.name}>
        <ColorSchemeSelectItemContent colorScheme={colorSchemeCrest} />
      </SelectItem>
      <SelectItem value={colorSchemeFlare.name}>
        <ColorSchemeSelectItemContent colorScheme={colorSchemeFlare} />
      </SelectItem>
      <SelectItem value={colorSchemeIcefire.name}>
        <ColorSchemeSelectItemContent colorScheme={colorSchemeIcefire} />
      </SelectItem>
      <SelectItem value={colorSchemeInferno.name}>
        <ColorSchemeSelectItemContent colorScheme={colorSchemeInferno} />
      </SelectItem>
      <SelectItem value={colorSchemeMagma.name}>
        <ColorSchemeSelectItemContent colorScheme={colorSchemeMagma} />
      </SelectItem>
      <SelectItem value={colorSchemeMako.name}>
        <ColorSchemeSelectItemContent colorScheme={colorSchemeMako} />
      </SelectItem>
      <SelectItem value={colorSchemePlasma.name}>
        <ColorSchemeSelectItemContent colorScheme={colorSchemePlasma} />
      </SelectItem>
      <SelectItem value={colorSchemeRocket.name}>
        <ColorSchemeSelectItemContent colorScheme={colorSchemeRocket} />
      </SelectItem>
      <SelectItem value={colorSchemeTurbo.name}>
        <ColorSchemeSelectItemContent colorScheme={colorSchemeTurbo} />
      </SelectItem>
      <SelectItem value={colorSchemeViridis.name}>
        <ColorSchemeSelectItemContent colorScheme={colorSchemeViridis} />
      </SelectItem>
      <SelectItem value={colorSchemeVlag.name}>
        <ColorSchemeSelectItemContent colorScheme={colorSchemeVlag} />
      </SelectItem>
    </Select>
  )
}

export const Default: Story = {
  render: () => <Component />
}
