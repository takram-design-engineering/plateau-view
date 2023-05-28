import { type Meta, type StoryObj } from '@storybook/react'
import { atom } from 'jotai'
import { useMemo, type FC } from 'react'

import { FloatingPanel } from './FloatingPanel'
import { LayerList } from './LayerList'
import { LayerListItem, type LayerListItemProps } from './LayerListItem'
import { BuildingIcon } from './icons'

const meta: Meta<typeof LayerListItem> = {
  title: 'LayerListItem',
  component: LayerListItem
}

export default meta

type Story = StoryObj<typeof LayerListItem>

const ItemComponent: FC<{ selected?: boolean }> = ({ selected = false }) => {
  const props = useMemo(
    () => ({
      id: 1,
      titleAtom: atom('レイヤー名称') as LayerListItemProps['titleAtom'],
      loadingAtom: atom(false),
      hiddenAtom: atom(false),
      iconComponent: BuildingIcon,
      selected
    }),
    [selected]
  )
  return <LayerListItem {...(props as unknown as LayerListItemProps)} />
}

export const Default: Story = {
  render: () => (
    <FloatingPanel sx={{ width: 360 }}>
      <LayerList>
        <ItemComponent />
        <ItemComponent />
        <ItemComponent selected />
      </LayerList>
    </FloatingPanel>
  )
}
