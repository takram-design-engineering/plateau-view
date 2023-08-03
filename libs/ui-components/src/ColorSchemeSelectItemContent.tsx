import { styled } from '@mui/material'
import { type FC } from 'react'

import { type ColorScheme } from '@takram/plateau-color-maps'

import { ColorSchemeGradient } from './ColorSchemeGradient'

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

export interface ColorSchemeSelectItemContentProps {
  colorScheme: ColorScheme
}

export const ColorSchemeSelectItemContent: FC<
  ColorSchemeSelectItemContentProps
> = ({ colorScheme }) => (
  <Root>
    <Name>{colorScheme.name}</Name>
    <ColorSchemeGradient colorScheme={colorScheme} />
  </Root>
)
