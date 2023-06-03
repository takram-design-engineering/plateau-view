import { type Scene } from '@cesium/engine'

export interface WaitUntilTilesLoadedOptions {
  initialTileCount?: number
  remainingTileCount?: number
  timeoutSeconds?: number
  onStart?: (count: number) => void
  onProgress?: (count: number) => void
  onComplete?: () => void
}

export function waitUntilTilesLoaded(
  scene: Scene,
  {
    initialTileCount = 0,
    remainingTileCount = 0,
    timeoutSeconds = 10,
    onStart,
    onProgress,
    onComplete
  }: WaitUntilTilesLoadedOptions = {}
): Promise<void> & { cancel: () => void } {
  let canceled = false
  let cancel: (() => void) | undefined

  const promise = Promise.race([
    new Promise<void>(resolve => {
      const timeout = setTimeout(resolve, timeoutSeconds * 1000)
      cancel = () => {
        resolve()
        clearTimeout(timeout)
      }
    }),
    new Promise<void>(resolve => {
      let started = false
      const listenForProgress = (): void => {
        const removeListener =
          scene.globe.tileLoadProgressEvent.addEventListener(
            (count: number) => {
              if (canceled) {
                removeListener()
                resolve()
                return
              }
              if (!started && count >= initialTileCount) {
                onStart?.(count)
                started = true
              }
              if (count > remainingTileCount) {
                onProgress?.(count)
              } else if (started || scene.globe.tilesLoaded) {
                removeListener()
                resolve()
              }
            }
          )
      }
      if (initialTileCount != null) {
        listenForProgress()
      } else {
        const removeListener = scene.postRender.addEventListener(() => {
          removeListener()
          if (scene.globe.tilesLoaded || canceled) {
            resolve()
            return
          }
          listenForProgress()
        })
      }
    })
  ]).then(() => {
    onComplete?.()
  })

  return Object.assign(promise, {
    cancel: () => {
      canceled = true
      cancel?.()
    }
  })
}
