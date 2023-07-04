import { Stack } from '@mui/material'
import { type Meta, type StoryObj } from '@storybook/react'
import { atom, useAtomValue } from 'jotai'
import { type FC } from 'react'

import {
  colorSchemeCividis,
  colorSchemeTurbo,
  colorSchemeViridis
} from '@takram/plateau-color-schemes'

import { QuantitativeColorLegend } from './QuantitativeColorLegend'
import { SliderParameterItem } from './SliderParameterItem'

const meta: Meta<typeof QuantitativeColorLegend> = {
  title: 'QuantitativeColorLegend',
  component: QuantitativeColorLegend
}

export default meta

type Story = StoryObj<typeof QuantitativeColorLegend>

const rangeAtom1 = atom([0, 1])
const rangeAtom2 = atom([0, 100])
const rangeAtom3 = atom([0, 100000])

const Component: FC = () => {
  const [min1, max1] = useAtomValue(rangeAtom1)
  const [min2, max2] = useAtomValue(rangeAtom2)
  const [min3, max3] = useAtomValue(rangeAtom3)
  return (
    <Stack spacing={2}>
      <SliderParameterItem min={0} max={1} range atom={rangeAtom1} />
      <QuantitativeColorLegend
        min={min1}
        max={max1}
        colorScheme={colorSchemeViridis}
      />
      <SliderParameterItem min={0} max={100} range atom={rangeAtom2} />
      <QuantitativeColorLegend
        min={min2}
        max={max2}
        colorScheme={colorSchemeCividis}
      />
      <SliderParameterItem min={0} max={100000} range atom={rangeAtom3} />
      <QuantitativeColorLegend
        min={min3}
        max={max3}
        colorScheme={colorSchemeTurbo}
      />
    </Stack>
  )
}

export const Default: Story = {
  render: () => <Component />
}
