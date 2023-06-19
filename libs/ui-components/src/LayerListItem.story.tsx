import { type Meta, type StoryObj } from '@storybook/react'
import { useCallback, useState, type FC } from 'react'

import { FloatingPanel } from './FloatingPanel'
import { BuildingIcon } from './icons'
import { LayerList } from './LayerList'
import { LayerListItem } from './LayerListItem'

const meta: Meta<typeof LayerListItem> = {
  title: 'LayerListItem',
  component: LayerListItem
}

export default meta

type Story = StoryObj<typeof LayerListItem>

const DefaultComponent: FC = () => {
  const [open, setOpen] = useState(true)
  const handleToggleOpen = useCallback(() => {
    setOpen(value => !value)
  }, [])

  return (
    <FloatingPanel sx={{ width: 360 }}>
      <LayerList
        open={open}
        onOpen={handleToggleOpen}
        onClose={handleToggleOpen}
      >
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
        <LayerListItem title='レイヤー名称' iconComponent={BuildingIcon} />
      </LayerList>
    </FloatingPanel>
  )
}

export const Default: Story = {
  render: () => <DefaultComponent />
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
        <LayerListItem
          title={{
            primary: 'レイヤー名称',
            secondary: '詳細な情報の付加'
          }}
          iconComponent={BuildingIcon}
        />
      </LayerList>
    </FloatingPanel>
  )
}
