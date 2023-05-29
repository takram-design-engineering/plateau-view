import { createSvgIcon, styled } from '@mui/material'

const Icon = createSvgIcon(
  <path d='M11.9995 16.0384L6.3457 10.38464L7.39953 9.33081L11.9995 13.9308L16.5995 9.33081L17.6534 10.38464L11.9995 16.0384Z' />,
  'ExpandArrow'
)

export const ExpandArrowIcon = styled(Icon, {
  shouldForwardProp: prop => prop !== 'expanded'
})<{
  expanded?: boolean
}>(({ theme, expanded = false }) => ({
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shorter
  }),
  ...(expanded && {
    transform: 'rotate(180deg)'
  })
}))
