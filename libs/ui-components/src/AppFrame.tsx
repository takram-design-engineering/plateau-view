import { styled } from '@mui/material'
import { type FC, type ReactNode } from 'react'

const Root = styled('div')({
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  position: 'fixed',
  inset: 0,
  touchAction: 'none'
})

const Header = styled('div')({
  flexGrow: 0,
  flexShrink: 0
})

const Body = styled('div')({
  position: 'relative',
  flexGrow: 1,
  flexShrink: 1
})

export interface AppFrameProps {
  header?: ReactNode
  children?: ReactNode
}

export const AppFrame: FC<AppFrameProps> = ({ header, children }) => (
  <Root>
    {header != null && <Header>{header}</Header>}
    {children != null && <Body>{children}</Body>}
  </Root>
)
