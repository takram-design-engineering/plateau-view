import { styled } from '@mui/material'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react'
import { memo, type FC, type ReactNode } from 'react'

import { DarkThemeOverride } from './DarkThemeOverride'

import 'overlayscrollbars/overlayscrollbars.css'

const Root = styled('div')({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gridAutoFlow: 'column',
  gridAutoColumns: 'fit-content(0)',
  direction: 'rtl',
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  '& > *': {
    direction: 'ltr'
  }
})

const DeveloperColumn = styled('div')({
  minHeight: 0
})

const DeveloperRoot = styled(OverlayScrollbarsComponent)(({ theme }) => ({
  height: '100%',
  backgroundColor: theme.palette.background.default,
  pointerEvents: 'auto'
}))

const Developer: FC<{ children?: ReactNode }> = props => (
  <DeveloperRoot
    options={{
      scrollbars: {
        autoHide: 'scroll',
        theme: 'os-theme-light'
      }
    }}
    defer
    {...props}
  />
)

const RootColumn = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateRows: '1fr',
  gridAutoFlow: 'row',
  gridAutoRows: 'fit-content(0)',
  minHeight: 0
}))

const RootGrid = styled('div', {
  shouldForwardProp: prop => prop !== 'spacing'
})<{ spacing?: number }>(({ theme, spacing = 0 }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gridColumnGap: theme.spacing(spacing),
  gridAutoFlow: 'column',
  gridAutoColumns: '',
  margin: theme.spacing(spacing),
  minHeight: 0
}))

const SizeContainer = styled('div')({
  containerType: 'size'
})

const MainContainer = styled('div', {
  shouldForwardProp: prop =>
    prop !== 'spacing' && prop !== 'mainWidth' && prop !== 'contextWidth'
})<{
  spacing?: number
  mainWidth: number
  contextWidth: number
}>(({ theme, spacing = 0, mainWidth, contextWidth }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  [`@container (min-width: calc(${mainWidth + contextWidth}px + ${theme.spacing(
    spacing
  )}))`]: {
    flexDirection: 'row',
    alignItems: 'stretch'
  }
}))

const Main = styled('main', {
  shouldForwardProp: prop =>
    prop !== 'spacing' && prop !== 'mainWidth' && prop !== 'contextWidth'
})<{
  spacing?: number
  mainWidth: number
  contextWidth: number
}>(({ theme, spacing = 0, mainWidth, contextWidth }) => ({
  flexBasis: 'auto',
  flexShrink: 1,
  flexGrow: 0,
  width: mainWidth,
  minHeight: 0,
  marginRight: theme.spacing(spacing),
  [`@container (min-width: calc(${mainWidth + contextWidth}px + ${theme.spacing(
    spacing
  )}))`]: {
    flexBasis: mainWidth,
    flexShrink: 0
  }
}))

const Context = styled('aside', {
  shouldForwardProp: prop =>
    prop !== 'spacing' && prop !== 'mainWidth' && prop !== 'contextWidth'
})<{
  spacing?: number
  mainWidth: number
  contextWidth: number
}>(({ theme, spacing = 0, mainWidth, contextWidth }) => ({
  position: 'relative',
  display: 'flex',
  flexGrow: 1,
  alignItems: 'start',
  width: mainWidth,
  minWidth: 0,
  marginTop: theme.spacing(spacing),
  [`@container (min-width: calc(${mainWidth + contextWidth}px + ${theme.spacing(
    spacing
  )}))`]: {
    width: 'auto',
    marginTop: 0
  }
}))

const BottomGrid = styled('div', {
  shouldForwardProp: prop => prop !== 'spacing'
})<{ spacing?: number }>(({ theme, spacing = 0 }) => ({
  display: 'grid',
  gridTemplateColumns: 'fit-content(0) fit-content(0)',
  gridColumnGap: theme.spacing(spacing),
  alignItems: 'end',
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}))

const BottomLeftColumn = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start'
})

const BottomRightColumn = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'end'
})

export interface AppLayoutProps {
  spacing?: number
  mainWidth?: number
  contextWidth?: number
  main?: ReactNode
  aside?: ReactNode
  context?: ReactNode
  bottomLeft?: ReactNode
  bottomRight?: ReactNode
  developer?: ReactNode
}

export const AppLayout: FC<AppLayoutProps> = memo(
  ({
    spacing = 1,
    mainWidth = 360,
    contextWidth = mainWidth,
    main,
    aside,
    context,
    bottomLeft,
    bottomRight,
    developer
  }) => (
    <Root>
      <RootColumn>
        <RootGrid spacing={spacing}>
          <SizeContainer>
            <MainContainer
              spacing={spacing}
              mainWidth={mainWidth}
              contextWidth={contextWidth}
            >
              <Main
                spacing={spacing}
                mainWidth={mainWidth}
                contextWidth={contextWidth}
              >
                {main}
              </Main>
              <Context
                spacing={spacing}
                mainWidth={mainWidth}
                contextWidth={contextWidth}
              >
                {context}
              </Context>
            </MainContainer>
          </SizeContainer>
          {aside}
        </RootGrid>
        <DarkThemeOverride>
          <BottomGrid spacing={spacing}>
            <BottomLeftColumn>{bottomLeft}</BottomLeftColumn>
            <BottomRightColumn>{bottomRight}</BottomRightColumn>
          </BottomGrid>
        </DarkThemeOverride>
      </RootColumn>
      {developer != null && (
        <DeveloperColumn>
          <DarkThemeOverride>
            <Developer>{developer}</Developer>
          </DarkThemeOverride>
        </DeveloperColumn>
      )}
    </Root>
  )
)
