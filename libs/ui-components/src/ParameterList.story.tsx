import { type Meta, type StoryObj } from '@storybook/react'
import { atom } from 'jotai'

import {
  colorSchemeMagma,
  type ColorScheme
} from '@takram/plateau-color-schemes'

import { ButtonParameterItem } from './ButtonParameterItem'
import { ColorSchemeParameterItem } from './ColorSchemeParameterItem'
import { ParameterList } from './ParameterList'
import { SegmentParameterItem } from './SegmentParameterItem'
import { SelectParameterItem } from './SelectParameterItem'
import { SliderParameterItem } from './SliderParameterItem'
import { SwitchParameterItem } from './SwitchParameterItem'

const meta: Meta<typeof ParameterList> = {
  title: 'ParameterList',
  component: ParameterList
}

export default meta

type Story = StoryObj<typeof ParameterList>

const switchAtom = atom(false)
const selectAtom = atom(1)
const sliderAtom1 = atom(1)
const sliderAtom2 = atom(1)
const sliderAtom3 = atom([1, 5])
const segmentAtom = atom([1])
const colorSchemeAtom = atom<ColorScheme>(colorSchemeMagma)

export const Default: Story = {
  render: () => (
    <ParameterList sx={{ width: 280 }}>
      <SwitchParameterItem label='Switch' atom={switchAtom} />
      <SelectParameterItem
        label='Select'
        atom={selectAtom}
        items={[
          [1, 'Value 1'],
          [2, 'Value 2'],
          [3, 'Value 3'],
          [4, 'Value 4']
        ]}
      />
      <SelectParameterItem
        label='Select'
        layout='stack'
        atom={selectAtom}
        items={[
          [1, 'Value 1'],
          [2, 'Value 2'],
          [3, 'Value 3'],
          [4, 'Value 4']
        ]}
      />
      <SliderParameterItem label='Slider' min={0} max={10} atom={sliderAtom1} />
      <SliderParameterItem
        label='Discrete Slider'
        min={0}
        max={10}
        step={1}
        atom={sliderAtom2}
      />
      <SliderParameterItem
        label='Range Slider'
        min={0}
        max={10}
        range
        atom={sliderAtom3}
      />
      <SegmentParameterItem
        label='Segment'
        // @ts-expect-error TODO: Fix type
        atom={segmentAtom}
        items={[
          [1, 'Value 1'],
          [2, 'Value 2'],
          [3, 'Value 3'],
          [4, 'Value 4']
        ]}
      />
      <ButtonParameterItem label='Button'>Button</ButtonParameterItem>
      <ColorSchemeParameterItem label='Color Scheme' atom={colorSchemeAtom} />
    </ParameterList>
  )
}
