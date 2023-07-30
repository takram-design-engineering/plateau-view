import { alpha, styled } from '@mui/material'
import { type FC } from 'react'

const Root = styled('div', {
  shouldForwardProp: prop => prop !== 'selected'
})<{
  selected?: boolean
}>(({ theme, selected = false }) => ({
  position: 'relative',
  ...(selected && {
    '&:before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      inset: -8,
      backgroundColor: alpha(
        theme.palette.primary.main,
        theme.palette.action.activatedOpacity
      ),
      border: `solid 2px ${theme.palette.primary.main}`,
      borderRadius: theme.shape.borderRadius,
      zIndex: -1
    }
  })
}))

const Item = styled('div')(({ theme }) => ({
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  width: 16,
  height: 16,
  borderRadius: 2,
  boxShadow: `inset 0 0 0 1px ${alpha(theme.palette.text.primary, 0.1)}`
}))

export interface ColorIconProps {
  color: string
  selected?: boolean
}

export const ColorIcon: FC<ColorIconProps> = ({ color, selected }) => (
  <Root selected={selected}>
    <Item style={{ backgroundColor: color }} />
  </Root>
)
