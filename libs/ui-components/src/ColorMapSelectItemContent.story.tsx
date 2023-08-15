import { Select, type SelectChangeEvent } from '@mui/material'
import { type Meta, type StoryObj } from '@storybook/react'
import { useState, type FC } from 'react'

import {
  colorMapCividis,
  colorMapCrest,
  colorMapFlare,
  colorMapIcefire,
  colorMapInferno,
  colorMapMagma,
  colorMapMako,
  colorMapPlasma,
  colorMapRocket,
  colorMapTurbo,
  colorMapViridis,
  colorMapVlag
} from '@takram/plateau-color-maps'

import { ColorMapSelectItemContent } from './ColorMapSelectItemContent'
import { SelectItem } from './SelectItem'

const meta: Meta<typeof ColorMapSelectItemContent> = {
  title: 'ColorMapSelectItemContent',
  component: ColorMapSelectItemContent
}

export default meta

type Story = StoryObj<typeof ColorMapSelectItemContent>

const Component: FC = () => {
  const [value, setValue] = useState('')
  const handleChange = <T,>(event: SelectChangeEvent<T>): void => {
    if (typeof event.target.value === 'string') {
      setValue(event.target.value)
    }
  }

  return (
    <Select variant='filled' size='small' value={value} onChange={handleChange}>
      <SelectItem value={colorMapCividis.name}>
        <ColorMapSelectItemContent colorMap={colorMapCividis} />
      </SelectItem>
      <SelectItem value={colorMapCrest.name}>
        <ColorMapSelectItemContent colorMap={colorMapCrest} />
      </SelectItem>
      <SelectItem value={colorMapFlare.name}>
        <ColorMapSelectItemContent colorMap={colorMapFlare} />
      </SelectItem>
      <SelectItem value={colorMapIcefire.name}>
        <ColorMapSelectItemContent colorMap={colorMapIcefire} />
      </SelectItem>
      <SelectItem value={colorMapInferno.name}>
        <ColorMapSelectItemContent colorMap={colorMapInferno} />
      </SelectItem>
      <SelectItem value={colorMapMagma.name}>
        <ColorMapSelectItemContent colorMap={colorMapMagma} />
      </SelectItem>
      <SelectItem value={colorMapMako.name}>
        <ColorMapSelectItemContent colorMap={colorMapMako} />
      </SelectItem>
      <SelectItem value={colorMapPlasma.name}>
        <ColorMapSelectItemContent colorMap={colorMapPlasma} />
      </SelectItem>
      <SelectItem value={colorMapRocket.name}>
        <ColorMapSelectItemContent colorMap={colorMapRocket} />
      </SelectItem>
      <SelectItem value={colorMapTurbo.name}>
        <ColorMapSelectItemContent colorMap={colorMapTurbo} />
      </SelectItem>
      <SelectItem value={colorMapViridis.name}>
        <ColorMapSelectItemContent colorMap={colorMapViridis} />
      </SelectItem>
      <SelectItem value={colorMapVlag.name}>
        <ColorMapSelectItemContent colorMap={colorMapVlag} />
      </SelectItem>
    </Select>
  )
}

export const Default: Story = {
  render: () => <Component />
}
