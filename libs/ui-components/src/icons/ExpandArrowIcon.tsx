import { createSvgIcon, styled } from '@mui/material'

const Icon = createSvgIcon(
  <path
    fillRule='evenodd'
    clipRule='evenodd'
    d='M6.57617 10.4242L7.4247 9.57568L12.0004 14.1514L16.5762 9.57568L17.4247 10.4242L12.0004 15.8485L6.57617 10.4242Z'
  />,
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
