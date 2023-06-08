import { Button, Stack } from '@mui/material'
import { type Meta, type StoryObj } from '@storybook/react'

import {
  AppLayout,
  ContextBar,
  DeveloperPanel,
  FloatingButton,
  FloatingPanel
} from '../src'

const meta: Meta<typeof AppLayout> = {
  title: 'AppLayout',
  component: AppLayout
}

export default meta

type Story = StoryObj<typeof AppLayout>

export const Default: Story = {
  render: () => (
    <AppLayout
      main={
        <Stack spacing={2}>
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
        <Stack direction='column' spacing={1}>
          <FloatingButton>Bottom Right</FloatingButton>
          <FloatingButton>Bottom Right</FloatingButton>
        </Stack>
      }
    />
  )
}

export const Inspector: Story = {
  render: () => (
    <AppLayout
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
        <FloatingPanel scrollable sx={{ width: 300 }}>
          <Stack spacing={2} margin={2}>
            {[...Array(50)].map((_, index) => (
              <div key={index}>Aside</div>
            ))}
          </Stack>
        </FloatingPanel>
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
    <AppLayout
      main={
        <Stack spacing={2}>
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
        <FloatingPanel scrollable sx={{ width: 300 }}>
          <Stack spacing={2} margin={2}>
            {[...Array(2)].map((_, index) => (
              <div key={index}>Aside</div>
            ))}
          </Stack>
        </FloatingPanel>
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
    <AppLayout
      main={
        <Stack spacing={2}>
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
