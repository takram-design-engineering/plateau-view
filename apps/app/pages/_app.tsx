import { ApolloProvider } from '@apollo/client'
import { CacheProvider, type EmotionCache } from '@emotion/react'
import { ThemeProvider } from '@mui/material/styles'
import { type AppType } from 'next/app'
import Head from 'next/head'
import { SnackbarProvider } from 'notistack'
import { type ComponentProps, type ComponentType } from 'react'
import invariant from 'tiny-invariant'

import { CssBaseline, lightTheme } from '@takram/plateau-ui-components'

import { createApolloClient } from '../src/createApolloClient'
import { createEmotionCache } from '../src/createEmotionCache'

const clientSideEmotionCache = createEmotionCache()
const apolloClient = createApolloClient()

if (typeof window !== 'undefined') {
  invariant(
    process.env.NEXT_PUBLIC_CESIUM_BASE_URL != null,
    'Missing environment variable: NEXT_PUBLIC_CESIUM_BASE_URL'
  )
  window.CESIUM_BASE_URL = process.env.NEXT_PUBLIC_CESIUM_BASE_URL
}

export interface AppProps {
  emotionCache?: EmotionCache
}

const App: ComponentType<ComponentProps<AppType> & AppProps> = ({
  emotionCache = clientSideEmotionCache,
  Component,
  pageProps
}) => {
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, maximum-scale=1'
        />
      </Head>
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <SnackbarProvider maxSnack={1}>
          <ApolloProvider client={apolloClient}>
            <Component {...pageProps} />
          </ApolloProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </CacheProvider>
  )
}

export default App
