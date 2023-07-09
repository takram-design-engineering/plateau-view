import { IconButton } from '@mui/material'
import { type Meta, type StoryObj } from '@storybook/react'
import { useCallback, useState, type FC } from 'react'

import { AppBar } from './AppBar'
import { AppBreadcrumbs } from './AppBreadcrumbs'
import { AppBreadcrumbsItem } from './AppBreadcrumbsItem'
import { AppToggleButton } from './AppToggleButton'
import { AppToggleButtonGroup } from './AppToggleButtonGroup'
import {
  HandIcon,
  LocationIcon,
  MinusIcon,
  PedestrianIcon,
  PlusIcon,
  PointerArrowIcon,
  RotateAroundIcon,
  SettingsIcon,
  SketchIcon,
  TimelineIcon
} from './icons'
import { Space } from './Space'

const meta: Meta<typeof AppBar> = {
  title: 'AppBar',
  component: AppBar
}

export default meta

type Story = StoryObj<typeof AppBar>

const Component: FC = () => {
  const [tool, setTool] = useState<string | null>(null)
  const handleChange = useCallback((event: unknown, value: string | null) => {
    if (value != null) {
      setTool(value)
    }
  }, [])

  return (
    <AppBar>
      <AppToggleButtonGroup value={tool} onChange={handleChange}>
        <AppToggleButton title='Hand' value='hand'>
          <HandIcon />
        </AppToggleButton>
        <AppToggleButton title='Select' value='select'>
          <PointerArrowIcon />
        </AppToggleButton>
        <AppToggleButton title='Sketch' value='sketch'>
          <SketchIcon />
        </AppToggleButton>
        <AppToggleButton title='Pedestrian' value='pedestrian'>
          <PedestrianIcon />
        </AppToggleButton>
      </AppToggleButtonGroup>
      <Space size={2} />
      <IconButton>
        <SettingsIcon />
      </IconButton>
      <IconButton>
        <TimelineIcon />
      </IconButton>
      <Space flexible />
      <AppBreadcrumbs>
        <AppBreadcrumbsItem>Prefecture</AppBreadcrumbsItem>
        <AppBreadcrumbsItem>City</AppBreadcrumbsItem>
        <AppBreadcrumbsItem>Municipality</AppBreadcrumbsItem>
      </AppBreadcrumbs>
      <Space flexible />
      <IconButton>
        <LocationIcon />
      </IconButton>
      <IconButton>
        <RotateAroundIcon />
      </IconButton>
      <IconButton>
        <MinusIcon />
      </IconButton>
      <IconButton>
        <PlusIcon />
      </IconButton>
    </AppBar>
  )
}

export const Default: Story = {
  render: () => <Component />
}
