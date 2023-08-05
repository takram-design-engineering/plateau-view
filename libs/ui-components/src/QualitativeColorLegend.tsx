import { Stack, styled, Tooltip } from '@mui/material'
import { useAtomValue } from 'jotai'
import { type ComponentPropsWithoutRef, type FC } from 'react'

import { type QualitativeColorSet } from '@takram/plateau-datasets'

import { ColorIcon } from './ColorIcon'

const Root = styled('div')({
  overflow: 'hidden'
})

const Cell = styled('div')(({ theme }) => ({
  padding: theme.spacing(0.5)
}))

export interface QualitativeColorLegendProps
  extends ComponentPropsWithoutRef<typeof Root> {
  colorSet: QualitativeColorSet
}

export const QualitativeColorLegend: FC<QualitativeColorLegendProps> = ({
  colorSet,
  ...props
}) => {
  const colors = useAtomValue(colorSet.colorsAtom)
  return (
    <Root {...props}>
      <Stack direction='row' margin={-0.5} useFlexGap flexWrap='wrap'>
        {colors.map(color => (
          <Tooltip
            key={color.name}
            title={color.name}
            enterDelay={0}
            leaveDelay={0}
          >
            <Cell>
              <ColorIcon color={color.color} />
            </Cell>
          </Tooltip>
        ))}
      </Stack>
    </Root>
  )
}
