import ZoomInOutlined from '@ant-design/icons/ZoomInOutlined'
import ZoomOutOutlined from '@ant-design/icons/ZoomOutOutlined'
import { ToggleButton } from '@mui/material'
import { type Meta, type StoryObj } from '@storybook/react'
import { atom, useAtom } from 'jotai'
import { type FC } from 'react'

import { AntIcon } from './AntIcon'
import { FloatingToolbar } from './FloatingToolbar'

const meta: Meta<typeof FloatingToolbar> = {
  title: 'FloatingToolbar',
  component: FloatingToolbar
}

export default meta

type Story = StoryObj<typeof FloatingToolbar>

const valueAtom = atom(1)

const StoryComponent: FC = () => {
  const [value, setValue] = useAtom(valueAtom)
  return (
    <FloatingToolbar
      value={value}
      onChange={(event, value) => {
        setValue(value)
      }}
    >
      <ToggleButton value={1}>Text Item</ToggleButton>
      <ToggleButton value={2}>Text Item</ToggleButton>
      <ToggleButton value={3}>
        <AntIcon IconComponent={ZoomInOutlined} />
      </ToggleButton>
      <ToggleButton value={4}>
        <AntIcon IconComponent={ZoomOutOutlined} />
      </ToggleButton>
    </FloatingToolbar>
  )
}

export const Default: Story = {
  render: () => <StoryComponent />
}
