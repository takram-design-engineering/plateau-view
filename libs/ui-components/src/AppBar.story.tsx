import {
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar
} from '@mui/material'
import { type Meta, type StoryObj } from '@storybook/react'
import { type FC } from 'react'

import { AppBar } from './AppBar'
import { DarkThemeOverride } from './DarkThemeOverride'
import {
  HandIcon,
  MinusIcon,
  PedestrianIcon,
  PlusIcon,
  PointerArrowIcon,
  RotateAroundIcon,
  SettingsIcon,
  SketchIcon,
  TimelineIcon
} from './icons'

const meta: Meta<typeof AppBar> = {
  title: 'AppBar',
  component: AppBar
}

export default meta

type Story = StoryObj<typeof AppBar>

const StoryComponent: FC = () => {
  return (
    <DarkThemeOverride>
      <AppBar elevation={0}>
        <Toolbar>
          <ToggleButtonGroup>
            <ToggleButton>
              <HandIcon />
            </ToggleButton>
            <ToggleButton>
              <PointerArrowIcon />
            </ToggleButton>
            <ToggleButton>
              <SketchIcon />
            </ToggleButton>
            <ToggleButton>
              <PedestrianIcon />
            </ToggleButton>
          </ToggleButtonGroup>
          <IconButton>
            <SettingsIcon />
          </IconButton>
          <IconButton>
            <TimelineIcon />
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
        </Toolbar>
      </AppBar>
    </DarkThemeOverride>
  )
}

export const Default: Story = {
  render: () => <StoryComponent />
}
