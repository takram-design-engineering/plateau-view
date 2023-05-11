import { type Event, type JulianDate, type Scene } from '@cesium/engine'
import { useEffect, useRef } from 'react'

import { useCesium } from './useCesium'

export type SceneEventType = {
  [K in keyof Scene]: Scene[K] extends Event ? K : never
}[keyof Scene]

export type SceneEventListener = (scene: Scene, currentTime: JulianDate) => void

export function useSceneEvent(
  type: SceneEventType,
  callback: SceneEventListener
): void {
  const scene = useCesium(({ scene }) => scene, { indirect: true })
  const callbackRef = useRef(callback)
  callbackRef.current = callback
  useEffect(() => {
    return scene?.[type].addEventListener(
      (scene: Scene, currentTime: JulianDate) => {
        callbackRef.current(scene, currentTime)
      }
    )
  }, [type, scene])
}

export function usePreUpdate(callback: SceneEventListener): void {
  useSceneEvent('preUpdate', callback)
}

export function usePostUpdate(callback: SceneEventListener): void {
  useSceneEvent('postUpdate', callback)
}

export function usePreRender(callback: SceneEventListener): void {
  useSceneEvent('preRender', callback)
}

export function usePostRender(callback: SceneEventListener): void {
  useSceneEvent('postRender', callback)
}