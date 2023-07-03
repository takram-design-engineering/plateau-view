import { Button, Stack } from '@mui/material'
import { type Meta, type StoryObj } from '@storybook/react'

import {
  AppOverlayLayout,
  ContextBar,
  DeveloperPanel,
  FloatingButton,
  FloatingPanel,
  Inspector as InspectorComponent
} from '../src'

const meta: Meta<typeof AppOverlayLayout> = {
  title: 'AppOverlayLayout',
  component: AppOverlayLayout
}

export default meta

type Story = StoryObj<typeof AppOverlayLayout>

export const Default: Story = {
  render: () => (
    <AppOverlayLayout
      main={
        <Stack spacing={1}>
          <FloatingPanel sx={{ padding: 2 }}>Panel</FloatingPanel>
          <FloatingPanel sx={{ padding: 2 }}>Panel</FloatingPanel>
        </Stack>
      }
      context={
        <ContextBar>
          <Button sx={{ flexShrink: 0 }} variant='text'>
            Context
          </Button>
          <Button sx={{ flexShrink: 0 }} variant='text'>
            Context
          </Button>
          <Button sx={{ flexShrink: 0 }} variant='text'>
            Context
          </Button>
          <Button sx={{ flexShrink: 0 }} variant='text'>
            Context
          </Button>
          <Button sx={{ flexShrink: 0 }} variant='text'>
            Context
          </Button>
        </ContextBar>
      }
      bottomLeft={
        <Stack direction='row' spacing={1}>
          <FloatingButton>Bottom Left</FloatingButton>
          <FloatingButton>Bottom Left</FloatingButton>
        </Stack>
      }
      bottomRight={
        <Stack direction='row' spacing={1}>
          <FloatingButton>Bottom Right</FloatingButton>
          <FloatingButton>Bottom Right</FloatingButton>
        </Stack>
      }
    />
  )
}

export const Inspector: Story = {
  render: () => (
    <AppOverlayLayout
      main={
        <FloatingPanel scrollable>
          <Stack spacing={2} margin={2}>
            {[...Array(20)].map((_, index) => (
              <div key={index}>Main</div>
            ))}
          </Stack>
        </FloatingPanel>
      }
      context={
        <ContextBar>
          <Button sx={{ flexShrink: 0 }} variant='text'>
            Context
          </Button>
          <Button sx={{ flexShrink: 0 }} variant='text'>
            Context
          </Button>
          <Button sx={{ flexShrink: 0 }} variant='text'>
            Context
          </Button>
          <Button sx={{ flexShrink: 0 }} variant='text'>
            Context
          </Button>
          <Button sx={{ flexShrink: 0 }} variant='text'>
            Context
          </Button>
        </ContextBar>
      }
      aside={
        <InspectorComponent>
          <Stack spacing={2} margin={2}>
            {[...Array(50)].map((_, index) => (
              <div key={index}>Aside</div>
            ))}
          </Stack>
        </InspectorComponent>
      }
      bottomLeft={
        <Stack direction='row' spacing={1}>
          <FloatingButton>Bottom Left</FloatingButton>
          <FloatingButton>Bottom Left</FloatingButton>
        </Stack>
      }
      bottomRight={
        <Stack direction='row' spacing={1}>
          <FloatingButton>Bottom Right</FloatingButton>
          <FloatingButton>Bottom Right</FloatingButton>
        </Stack>
      }
    />
  )
}

export const InspectorFitHeight: Story = {
  render: () => (
    <AppOverlayLayout
      main={
        <Stack spacing={1}>
          <FloatingPanel sx={{ padding: 2 }}>Panel</FloatingPanel>
          <FloatingPanel sx={{ padding: 2 }}>Panel</FloatingPanel>
        </Stack>
      }
      context={
        <ContextBar>
          <Button sx={{ flexShrink: 0 }} variant='text'>
            Context
          </Button>
          <Button sx={{ flexShrink: 0 }} variant='text'>
            Context
          </Button>
          <Button sx={{ flexShrink: 0 }} variant='text'>
            Context
          </Button>
          <Button sx={{ flexShrink: 0 }} variant='text'>
            Context
          </Button>
          <Button sx={{ flexShrink: 0 }} variant='text'>
            Context
          </Button>
        </ContextBar>
      }
      aside={
        <InspectorComponent>
          <Stack spacing={2} margin={2}>
            {[...Array(2)].map((_, index) => (
              <div key={index}>Aside</div>
            ))}
          </Stack>
        </InspectorComponent>
      }
      bottomLeft={
        <Stack direction='row' spacing={1}>
          <FloatingButton>Bottom Left</FloatingButton>
          <FloatingButton>Bottom Left</FloatingButton>
        </Stack>
      }
      bottomRight={
        <Stack direction='row' spacing={1}>
          <FloatingButton>Bottom Right</FloatingButton>
          <FloatingButton>Bottom Right</FloatingButton>
        </Stack>
      }
    />
  )
}

export const Developer: Story = {
  render: () => (
    <AppOverlayLayout
      main={
        <Stack spacing={1}>
          <FloatingPanel sx={{ padding: 2 }}>Panel</FloatingPanel>
          <FloatingPanel sx={{ padding: 2 }}>Panel</FloatingPanel>
        </Stack>
      }
      context={
        <ContextBar>
          <Button sx={{ flexShrink: 0 }} variant='text'>
            Context
          </Button>
          <Button sx={{ flexShrink: 0 }} variant='text'>
            Context
          </Button>
          <Button sx={{ flexShrink: 0 }} variant='text'>
            Context
          </Button>
          <Button sx={{ flexShrink: 0 }} variant='text'>
            Context
          </Button>
          <Button sx={{ flexShrink: 0 }} variant='text'>
            Context
          </Button>
        </ContextBar>
      }
      bottomLeft={
        <Stack direction='row' spacing={1}>
          <FloatingButton>Bottom Left</FloatingButton>
          <FloatingButton>Bottom Left</FloatingButton>
        </Stack>
      }
      bottomRight={
        <Stack direction='row' spacing={1}>
          <FloatingButton>Bottom Right</FloatingButton>
          <FloatingButton>Bottom Right</FloatingButton>
        </Stack>
      }
      developer={
        <Stack spacing={1} width={320} margin={1}>
          {[...Array(10)].map((_, index) => (
            <DeveloperPanel key={index}>
              {[...Array(5)].map((_, index) => (
                <div key={index}>Developer</div>
              ))}
            </DeveloperPanel>
          ))}
        </Stack>
      }
    />
  )
}
