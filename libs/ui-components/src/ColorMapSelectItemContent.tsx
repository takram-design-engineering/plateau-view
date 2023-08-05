import { styled } from '@mui/material'
import { type FC } from 'react'

import { type ColorMap } from '@takram/plateau-color-maps'

import { ColorMapGradient } from './ColorMapGradient'

const Root = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  marginRight: theme.spacing(0.5)
}))

const Name = styled('div')(({ theme }) => ({
  ...theme.typography.body2,
  overflow: 'hidden',
  flexShrink: 0,
  flexGrow: 0,
  width: theme.spacing(6),
  marginRight: theme.spacing(2),
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis'
}))

export interface ColorMapSelectItemContentProps {
  colorMap: ColorMap
}

export const ColorMapSelectItemContent: FC<ColorMapSelectItemContentProps> = ({
  colorMap
}) => (
  <Root>
    <Name>{colorMap.name}</Name>
    <ColorMapGradient colorMap={colorMap} />
  </Root>
)
