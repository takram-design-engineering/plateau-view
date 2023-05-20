import { List } from '@mui/material'
import { type Meta, type StoryObj } from '@storybook/react'
import { atom } from 'jotai'
import { useMemo, type FC } from 'react'

import { type LayerModel } from '@takram/plateau-layers'

import { FloatingPanel } from './FloatingPanel'
import { LayerListItem } from './LayerListItem'

const meta: Meta<typeof LayerListItem> = {
  title: 'LayerListItem',
  component: LayerListItem
}

export default meta

type Story = StoryObj<typeof LayerListItem>

const ItemComponent: FC<{ selected?: boolean }> = ({ selected = false }) => {
  const layerAtom = useMemo(
    () =>
      atom<LayerModel>({
        id: '1',
        type: 'BUILDING_LAYER',
        titleAtom: atom('レイヤー名称'),
        readyAtom: atom(true),
        hiddenAtom: atom(false),
        selectedAtom: atom(selected)
      }),
    [selected]
  )
  return <LayerListItem layerAtom={layerAtom} />
}

export const Default: Story = {
  render: () => (
    <FloatingPanel sx={{ width: 360 }}>
      <List>
        <ItemComponent />
        <ItemComponent />
        <ItemComponent selected />
      </List>
    </FloatingPanel>
  )
}
