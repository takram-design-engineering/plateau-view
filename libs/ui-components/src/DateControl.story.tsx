import { type Meta, type StoryObj } from '@storybook/react'
import { useCallback, useState, type FC } from 'react'

import { DateControl } from './DateControl'
import { FloatingPanel } from './FloatingPanel'

const meta: Meta<typeof DateControl> = {
  title: 'DateControl',
  component: DateControl
}

export default meta

type Story = StoryObj<typeof DateControl>

const Component: FC = () => {
  const [date, setDate] = useState(new Date())
  const handleChange = useCallback((event: unknown, date: Date) => {
    setDate(date)
  }, [])
  return (
    <FloatingPanel sx={{ width: 600 }}>
      <DateControl
        date={date}
        longitude={139}
        latitude={35}
        onChange={handleChange}
      />
    </FloatingPanel>
  )
}

export const Default: Story = {
  render: () => <Component />
}
