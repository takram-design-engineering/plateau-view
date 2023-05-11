import createEmotionServer from '@emotion/server/create-instance'
import { type AppType } from 'next/app'
import NextDocument, {
  Head,
  Html,
  Main,
  NextScript,
  type DocumentContext,
  type DocumentInitialProps,
  type DocumentProps as NextDocumentProps
} from 'next/document'
import React, { type ComponentProps, type ComponentType } from 'react'

import { createEmotionCache } from '../src/createEmotionCache'
import { type AppProps } from './_app'

interface DocumentProps extends NextDocumentProps {
  emotionStyleTags: JSX.Element[]
}

class Document extends NextDocument<DocumentProps> {
  render(): JSX.Element {
    return (
      <Html lang='ja'>
        <Head>
          <link rel='shortcut icon' href='/favicon.ico' />
          <meta name='emotion-insertion-point' content='' />
          <link rel='stylesheet' href='https://use.typekit.net/vgl5alg.css' />
          {this.props.emotionStyleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }

  static async getInitialProps(
    context: DocumentContext
  ): Promise<DocumentInitialProps> {
    const originalRenderPage = context.renderPage
    const cache = createEmotionCache()
    const { extractCriticalToChunks } = createEmotionServer(cache)
    context.renderPage = async () =>
      await originalRenderPage({
        enhanceApp:
          (App: ComponentType<ComponentProps<AppType> & AppProps>) => props =>
            <App emotionCache={cache} {...props} />
      })
    const initialProps = await super.getInitialProps(context)
    const emotionStyles = extractCriticalToChunks(initialProps.html)
    const emotionStyleTags = emotionStyles.styles.map(style => (
      <style
        data-emotion={`${style.key} ${style.ids.join(' ')}`}
        key={style.key}
        dangerouslySetInnerHTML={{ __html: style.css }}
      />
    ))
    return {
      ...initialProps,
      styles: [
        ...React.Children.toArray(initialProps.styles),
        ...emotionStyleTags
      ]
    }
  }
}

export default Document
