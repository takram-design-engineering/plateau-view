import { Stack } from '@mui/material'
import { type Meta, type StoryObj } from '@storybook/react'
import { useAtomValue } from 'jotai'
import { type FC } from 'react'

import { floodRankColorSet, landUseColorSet } from '@takram/plateau-datasets'

import { QualitativeColorLegend } from './QualitativeColorLegend'

const meta: Meta<typeof QualitativeColorLegend> = {
  title: 'QualitativeColorLegend',
  component: QualitativeColorLegend
}

export default meta

type Story = StoryObj<typeof QualitativeColorLegend>

const Component: FC = () => {
  return (
    <Stack spacing={2}>
      <QualitativeColorLegend
        colors={useAtomValue(floodRankColorSet.colorsAtom)}
      />
      <QualitativeColorLegend
        colors={useAtomValue(landUseColorSet.colorsAtom)}
      />
    </Stack>
  )
}

export const Default: Story = {
  render: () => <Component />
}
