import { type Meta, type StoryObj } from '@storybook/react'

import { FloatingPanel } from './FloatingPanel'
import { LayerList } from './LayerList'
import { LayerListItem } from './LayerListItem'
import { BuildingIcon } from './icons'

const meta: Meta<typeof LayerListItem> = {
  title: 'LayerListItem',
  component: LayerListItem
}

export default meta

type Story = StoryObj<typeof LayerListItem>

export const Default: Story = {
  render: () => (
    <FloatingPanel sx={{ width: 360 }}>
      <LayerList>
        <LayerListItem title='レイヤー名称' iconComponent={BuildingIcon} />
        <LayerListItem
          title='レイヤー名称'
          iconComponent={BuildingIcon}
          highlighted
        />
        <LayerListItem
          title='レイヤー名称'
          iconComponent={BuildingIcon}
          selected
        />
        <LayerListItem
          title='レイヤー名称'
          iconComponent={BuildingIcon}
          hidden
        />
        <LayerListItem
          title='レイヤー名称'
          iconComponent={BuildingIcon}
          highlighted
          hidden
        />
        <LayerListItem
          title='レイヤー名称'
          iconComponent={BuildingIcon}
          selected
          hidden
        />
      </LayerList>
    </FloatingPanel>
  )
}

export const Subtitled: Story = {
  render: () => (
    <FloatingPanel sx={{ width: 360 }}>
      <LayerList>
        <LayerListItem
          title={{
            primary: 'レイヤー名称',
            secondary: '詳細な情報の付加'
          }}
          iconComponent={BuildingIcon}
        />
        <LayerListItem
          title={{
            primary: 'レイヤー名称',
            secondary: '詳細な情報の付加'
          }}
          iconComponent={BuildingIcon}
          highlighted
        />
        <LayerListItem
          title={{
            primary: 'レイヤー名称',
            secondary: '詳細な情報の付加'
          }}
          iconComponent={BuildingIcon}
          selected
        />
        <LayerListItem
          title={{
            primary: 'レイヤー名称',
            secondary: '詳細な情報の付加'
          }}
          iconComponent={BuildingIcon}
          hidden
        />
        <LayerListItem
          title={{
            primary: 'レイヤー名称',
            secondary: '詳細な情報の付加'
          }}
          iconComponent={BuildingIcon}
          highlighted
          hidden
        />
        <LayerListItem
          title={{
            primary: 'レイヤー名称',
            secondary: '詳細な情報の付加'
          }}
          iconComponent={BuildingIcon}
          selected
          hidden
        />
      </LayerList>
    </FloatingPanel>
  )
}
