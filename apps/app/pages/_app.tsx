import { ApolloProvider } from '@apollo/client'
import { CacheProvider, type EmotionCache } from '@emotion/react'
import { ThemeProvider } from '@mui/material/styles'
import { type AppType } from 'next/app'
import Head from 'next/head'
import { type ComponentProps, type ComponentType } from 'react'
import invariant from 'tiny-invariant'

import { CssBaseline, lightTheme } from '@plateau/ui-components'

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
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head>
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <ApolloProvider client={apolloClient}>
          <Component {...pageProps} />
        </ApolloProvider>
      </ThemeProvider>
    </CacheProvider>
  )
}

export default App
