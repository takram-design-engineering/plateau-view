import { css, GlobalStyles, styled } from '@mui/material'
import { useAtom } from 'jotai'
import { debounce, omit, pick } from 'lodash'
import {
  forwardRef,
  useEffect,
  useRef,
  type ComponentPropsWithRef,
  type ForwardedRef
} from 'react'
import { mergeRefs } from 'react-merge-refs'
import { useIsomorphicLayoutEffect } from 'react-use'
import invariant from 'tiny-invariant'

import {
  assignForwardedRef,
  assignPropertyProps
} from '@takram/plateau-react-helpers'

import { CesiumRoot, type CesiumRootOptions } from './CesiumRoot'
import { DefaultImageryProvider } from './DefaultImageryProvider'
import { requestRenderInNextFrame } from './requestRenderInNextFrame'
import { cesiumAtom } from './states'

const Root = styled('div')({
  overflow: 'hidden',
  position: 'relative'
})

const Container = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0
})

const optionKeys = ['scene3DOnly'] as const

const mutableOptions = {
  resolutionScale: 1,
  useDefaultRenderLoop: true,
  useBrowserRecommendedResolution: true
}

const mutableSceneOptions = {
  msaaSamples: 4,
  requestRenderMode: true,
  maximumRenderTimeChange: 0
}

const mutableClockOptions = {
  shouldAnimate: false
}

type MutableOptionProps = Partial<
  typeof mutableOptions &
    typeof mutableSceneOptions &
    typeof mutableClockOptions
>

function assignMutableOptionProps(
  cesium: CesiumRoot,
  props: MutableOptionProps
): void {
  assignPropertyProps(cesium, props, mutableOptions)
  assignPropertyProps(cesium.scene, props, mutableSceneOptions)
  assignPropertyProps(cesium.clock, props, mutableClockOptions)
}

export interface CanvasProps
  extends ComponentPropsWithRef<typeof Root>,
    Pick<CesiumRootOptions, (typeof optionKeys)[number]>,
    MutableOptionProps {
  cesiumRef?: ForwardedRef<CesiumRoot | null>
  constructorOptions?: () => CesiumRootOptions
}

export const Canvas = forwardRef<HTMLDivElement, CanvasProps>(
  (
    { cesiumRef: forwardedCesiumRef, constructorOptions, children, ...props },
    forwardedRef
  ) => {
    const rootRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const [cesium, setCesium] = useAtom(cesiumAtom)
    const cesiumRef = useRef(cesium)
    cesiumRef.current = cesium

    // Debounce WebGL context resize.
    useIsomorphicLayoutEffect(() => {
      invariant(rootRef.current != null)
      invariant(containerRef.current != null)

      const rect = rootRef.current.getBoundingClientRect()
      const container = containerRef.current
      container.style.width = `${rect.width}px`
      container.style.height = `${rect.height}px`

      const observer = new ResizeObserver(
        debounce<ResizeObserverCallback>(([entry]) => {
          const container = containerRef.current
          if (container != null) {
            container.style.width = `${entry.contentRect.width}px`
            container.style.height = `${entry.contentRect.height}px`
          }
          if (cesiumRef.current?.scene != null) {
            requestRenderInNextFrame(cesiumRef.current.scene)
          }
        }, 200)
      )
      observer.observe(rootRef.current)
      return () => {
        observer.disconnect()
      }
    }, [])

    useIsomorphicLayoutEffect(
      () => {
        invariant(containerRef.current != null)
        const cesium = new CesiumRoot(
          containerRef.current,
          {
            showRenderLoopErrors: false,
            skyBox: false,
            ...constructorOptions?.(),
            ...pick(props, [
              ...optionKeys,
              ...Object.keys(mutableOptions),
              ...Object.keys(mutableSceneOptions),
              ...Object.keys(mutableClockOptions)
            ]),

            // This option is deprecated, but Cesium tries to access their
            // endpoint without this, which slows down the first view.
            imageryProvider: new DefaultImageryProvider(),

            // TODO: Reroute credits
            creditContainer: document.createElement('div'),
            creditViewport: document.createElement('div')
          },
          false
        )

        // Remove the default imagery layer, which sometimes persists even when
        // false is passed to `baseLayer` above.
        cesium.scene.imageryLayers.removeAll()

        // Reading pixel values from the GPU buffer is not a trivial task,
        // and I cannot afford to do so every frame by camera controller.
        cesium.scene.useDepthPicking = false

        setCesium(prevCesium => {
          if (prevCesium != null) {
            throw new Error('Cesium already exists in context.')
          }
          return cesium
        })
        assignMutableOptionProps(cesium, props)
        assignForwardedRef(forwardedCesiumRef, cesium)
        return () => {
          setCesium(null)
          cesium.render = () => {}

          // TODO: Cesium destructs all the attached instances recursively, but
          // React components are unmounted from the root node. Need to queue
          // destructors and invoke them after the root is destroyed.
          setTimeout(() => {
            cesium.destroy()
          }, 1000)
        }
      },
      // Intentionally refer to the initial state only. Subsequent updates will
      // be addressed below.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
    )

    if (cesium != null) {
      assignMutableOptionProps(cesium, props)
    }

    useEffect(
      () => assignForwardedRef(forwardedCesiumRef, cesium),
      [forwardedCesiumRef, cesium]
    )

    return (
      <Root
        ref={mergeRefs([rootRef, forwardedRef])}
        {...omit(props, [
          ...optionKeys,
          ...Object.keys(mutableOptions),
          ...Object.keys(mutableSceneOptions),
          ...Object.keys(mutableClockOptions)
        ])}
      >
        <Container ref={containerRef} />
        <GlobalStyles
          styles={css`
            .cesium-widget,
            .cesium-widget canvas {
              display: block;
              width: 100%;
              height: 100%;
            }
          `}
        />
        {cesium != null && children}
      </Root>
    )
  }
)
