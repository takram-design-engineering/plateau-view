import createCache, { type EmotionCache } from '@emotion/cache'

export function createEmotionCache(): EmotionCache {
  let insertionPoint: HTMLMetaElement | undefined
  if (typeof window !== 'undefined') {
    const emotionInsertionPoint = document.querySelector<HTMLMetaElement>(
      'meta[name="emotion-insertion-point"]'
    )
    insertionPoint = emotionInsertionPoint ?? undefined
  }
  return createCache({ key: 'mui-style', insertionPoint })
}
