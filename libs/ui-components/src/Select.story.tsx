import {
  Select,
  Stack,
  Typography,
  type SelectChangeEvent,
  type SelectProps
} from '@mui/material'
import { type Meta, type StoryObj } from '@storybook/react'
import { useState, type FC } from 'react'

import { SelectGroupItem } from './SelectGroupItem'
import { SelectItem } from './SelectItem'

const meta: Meta<typeof Select> = {
  title: 'Select',
  component: Select
}

export default meta

type Story = StoryObj<typeof Select>

const Selects: FC<SelectProps> = props => {
  const [value, setValue] = useState(0)
  const handleChange = <T,>(event: SelectChangeEvent<T>): void => {
    if (typeof event.target.value === 'number') {
      setValue(event.target.value)
    }
  }
  return (
    <Stack spacing={4}>
      <Select {...props} value={value} onChange={handleChange}>
        <SelectItem value={0}>Select Item</SelectItem>
        <SelectItem value={1}>Select Item</SelectItem>
        <SelectGroupItem>Group</SelectGroupItem>
        <SelectItem value={2} indent={1}>
          Select Item
        </SelectItem>
        <SelectItem value={3} indent={1}>
          Select Item
        </SelectItem>
        <SelectItem value={4}>Select Item</SelectItem>
        <SelectItem value={5}>Select Item</SelectItem>
      </Select>
      <Select {...props} size='small' value={value} onChange={handleChange}>
        <SelectItem value={0}>
          <Typography variant='body2'>Select Item</Typography>
        </SelectItem>
        <SelectItem value={1}>
          <Typography variant='body2'>Select Item</Typography>
        </SelectItem>
        <SelectGroupItem size='small'>Group</SelectGroupItem>
        <SelectItem value={2} indent={1}>
          <Typography variant='body2'>Select Item</Typography>
        </SelectItem>
        <SelectItem value={3} indent={1}>
          <Typography variant='body2'>Select Item</Typography>
        </SelectItem>
        <SelectItem value={4}>
          <Typography variant='body2'>Select Item</Typography>
        </SelectItem>
        <SelectItem value={5}>
          <Typography variant='body2'>Select Item</Typography>
        </SelectItem>
      </Select>
    </Stack>
  )
}

export const Default: Story = {
  render: () => (
    <Stack direction='row' spacing={4}>
      <Selects variant='outlined' />
      <Selects variant='filled' />
    </Stack>
  )
}
