import { Slider, Stack } from '@mui/material'
import { type Meta, type StoryObj } from '@storybook/react'
import { endOfYear, parseISO } from 'date-fns'
import { useCallback, useState, type FC } from 'react'

import { DateSlider } from './DateSlider'

const meta: Meta<typeof DateSlider> = {
  title: 'DateSlider',
  component: DateSlider
}

export default meta

type Story = StoryObj<typeof DateSlider>

const min = +parseISO('2020-01-01')
const max = +endOfYear(parseISO('2020-01-01'))

const Component: FC = () => {
  const [value, setValue] = useState(min)
  const handleChange = useCallback(
    (event: unknown, value: number | number[]) => {
      if (typeof value === 'number') {
        setValue(value)
      }
    },
    []
  )
  return (
    <Stack width={500}>
      <DateSlider min={min} max={max} value={value} onChange={handleChange} />
      <Slider min={min} max={max} value={value} onChange={handleChange} />
    </Stack>
  )
}

export const Default: Story = {
  render: () => <Component />
}
