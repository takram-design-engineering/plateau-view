import { Divider, IconButton } from '@mui/material'
import { type Meta, type StoryObj } from '@storybook/react'
import { atom } from 'jotai'

import { FloatingPanel } from './FloatingPanel'
import { GroupedParameterItem } from './GroupedParameterItem'
import {
  BuildingIcon,
  LocationIcon,
  SearchIcon,
  TrashIcon,
  VisibilityOnIcon
} from './icons'
import { Inspector } from './Inspector'
import { InspectorActions } from './InspectorActions'
import { InspectorHeader } from './InspectorHeader'
import { InspectorItem } from './InspectorItem'
import { NumberParameterItem } from './NumberParameterItem'
import { ParameterList } from './ParameterList'
import { SegmentParameterItem } from './SegmentParameterItem'
import { SelectParameterItem } from './SelectParameterItem'
import { SliderParameterItem } from './SliderParameterItem'
import { SwitchParameterItem } from './SwitchParameterItem'

const meta: Meta<typeof Inspector> = {
  title: 'Inspector',
  component: Inspector
}

export default meta

type Story = StoryObj<typeof Inspector>

const switchAtom = atom(false)
const selectAtom = atom(1)
const sliderAtom1 = atom(1)
const sliderAtom2 = atom([1, 5])
const segmentAtom = atom(1)

export const Default: Story = {
  render: () => (
    <FloatingPanel sx={{ width: 360 }}>
      <Inspector>
        <InspectorHeader
          title={{
            primary: 'オブジェクト名称',
            secondary: '詳細な情報の付加'
          }}
          iconComponent={BuildingIcon}
        />
        <Divider />
        <InspectorActions>
          <IconButton>
            <VisibilityOnIcon />
          </IconButton>
          <IconButton>
            <SearchIcon />
          </IconButton>
          <IconButton>
            <LocationIcon />
          </IconButton>
          <IconButton>
            <TrashIcon />
          </IconButton>
        </InspectorActions>
        <Divider />
        <InspectorItem>
          <ParameterList>
            <SwitchParameterItem label='Switch' atom={switchAtom} />
            <SelectParameterItem
              label='Select'
              atom={selectAtom}
              items={[
                [1, 'Value 1'],
                [2, 'Value 2'],
                [3, 'Value 3'],
                [4, 'Value 4']
              ]}
            />
            <SelectParameterItem
              label='Select'
              layout='stack'
              atom={selectAtom}
              items={[
                [1, 'Value 1'],
                [2, 'Value 2'],
                [3, 'Value 3'],
                [4, 'Value 4']
              ]}
            />
            <SliderParameterItem
              label='Slider'
              min={0}
              max={10}
              unit='unit'
              atom={sliderAtom1}
            />
            <NumberParameterItem
              label='Number'
              unit='unit'
              atom={sliderAtom1}
            />
            <GroupedParameterItem label='Group'>
              <InspectorItem>
                <ParameterList>
                  <SliderParameterItem
                    label='Range Slider'
                    min={0}
                    max={10}
                    range
                    atom={sliderAtom2}
                  />
                  <SegmentParameterItem
                    label='Segment'
                    // @ts-expect-error TODO: Fix type
                    atom={segmentAtom}
                    items={[
                      [1, 'Value 1'],
                      [2, 'Value 2'],
                      [3, 'Value 3'],
                      [4, 'Value 4']
                    ]}
                  />
                </ParameterList>
              </InspectorItem>
            </GroupedParameterItem>
          </ParameterList>
        </InspectorItem>
      </Inspector>
    </FloatingPanel>
  )
}
