import { Box, Typography, type SelectChangeEvent } from '@mui/material'
import { type Meta, type StoryObj } from '@storybook/react'
import { useCallback, useState, type FC } from 'react'

import { ContextBar } from './ContextBar'
import { ContextButton } from './ContextButton'
import { ContextButtonSelect } from './ContextButtonSelect'
import { ContextSelect } from './ContextSelect'
import { SelectItem } from './SelectItem'

const meta: Meta<typeof ContextBar> = {
  title: 'ContextBar',
  component: ContextBar
}

export default meta

type Story = StoryObj<typeof ContextBar>

const ButtonComponent: FC = () => {
  const [selected, setSelected] = useState(false)
  const handleClick = useCallback(() => {
    setSelected(value => !value)
  }, [])
  return (
    <ContextButton selected={selected} onClick={handleClick}>
      Single Button
    </ContextButton>
  )
}

const ButtonSelectComponent: FC = () => {
  const defaultValue = '1'
  const [value, setValue] = useState<string>('')
  const handleClick = useCallback(() => {
    setValue(prevValue => (prevValue === '' ? defaultValue : ''))
  }, [])
  const handleChange = useCallback((event: SelectChangeEvent<string>) => {
    setValue(event.target.value)
  }, [])
  return (
    <ContextButtonSelect
      label='Single Select'
      value={value}
      onChange={handleChange}
      onClick={handleClick}
    >
      {[...Array(5)].map((_, index) => (
        <SelectItem key={index} value={`${index}`}>
          <Typography variant='body2'>Item {index + 1}</Typography>
        </SelectItem>
      ))}
    </ContextButtonSelect>
  )
}

const SelectComponent: FC = () => {
  const [value, setValue] = useState<string[]>([])
  const handleChange = useCallback((event: SelectChangeEvent<string[]>) => {
    if (Array.isArray(event.target.value)) {
      setValue(event.target.value)
    }
  }, [])
  return (
    <ContextSelect
      label='Multiple Select'
      value={value}
      onChange={handleChange}
    >
      {[...Array(10)].map((_, index) => (
        <SelectItem key={index} value={`${index}`}>
          <Typography variant='body2'>Item {index + 1}</Typography>
        </SelectItem>
      ))}
    </ContextSelect>
  )
}

export const Default: Story = {
  render: () => (
    <ContextBar>
      <ButtonComponent />
      <ButtonSelectComponent />
      <SelectComponent />
    </ContextBar>
  )
}

const OverflowContextBar: FC = () => {
  const [expanded, setExpanded] = useState(false)
  const handleCollapse = useCallback(() => {
    setExpanded(false)
  }, [])
  const handleExpand = useCallback(() => {
    setExpanded(true)
  }, [])

  return (
    <Box maxWidth={theme => `calc(100vw + ${theme.spacing(-4)})`} height={200}>
      <ContextBar
        expanded={expanded}
        onCollapse={handleCollapse}
        onExpand={handleExpand}
      >
        <ButtonComponent />
        <ButtonSelectComponent />
        <SelectComponent />
        <ButtonComponent />
        <ButtonSelectComponent />
        <SelectComponent />
      </ContextBar>
    </Box>
  )
}

export const Overflow: Story = {
  render: () => <OverflowContextBar />
}

const StartAdornmentContextBar: FC = () => {
  const [expanded, setExpanded] = useState(false)
  const handleCollapse = useCallback(() => {
    setExpanded(false)
  }, [])
  const handleExpand = useCallback(() => {
    setExpanded(true)
  }, [])

  return (
    <Box maxWidth={theme => `calc(100vw + ${theme.spacing(-4)})`} height={200}>
      <ContextBar
        expanded={expanded}
        onCollapse={handleCollapse}
        onExpand={handleExpand}
        startAdornment={<ButtonComponent />}
      >
        <ButtonComponent />
        <ButtonSelectComponent />
        <SelectComponent />
        <ButtonComponent />
        <ButtonSelectComponent />
        <SelectComponent />
      </ContextBar>
    </Box>
  )
}

export const StartAdornment: Story = {
  render: () => <StartAdornmentContextBar />
}

const VerticalStartAdornmentContextBar: FC = () => {
  const [expanded, setExpanded] = useState(false)
  const handleCollapse = useCallback(() => {
    setExpanded(false)
  }, [])
  const handleExpand = useCallback(() => {
    setExpanded(true)
  }, [])

  return (
    <Box maxWidth={theme => `calc(100vw + ${theme.spacing(-4)})`} height={200}>
      <ContextBar
        orientation='vertical'
        expanded={expanded}
        onCollapse={handleCollapse}
        onExpand={handleExpand}
        startAdornment={<ButtonComponent />}
      >
        <ButtonComponent />
        <ButtonSelectComponent />
        <SelectComponent />
        <ButtonComponent />
        <ButtonSelectComponent />
        <SelectComponent />
      </ContextBar>
    </Box>
  )
}

export const VerticalStartAdornment: Story = {
  render: () => <VerticalStartAdornmentContextBar />
}
