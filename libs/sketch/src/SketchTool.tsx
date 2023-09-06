import { Cartesian2, Cartesian3, ScreenSpaceEventType } from '@cesium/engine'
import { feature } from '@turf/turf'
import { atom, useAtom, useSetAtom } from 'jotai'
import { nanoid } from 'nanoid'
import { useCallback, useMemo, useRef, type FC } from 'react'
import invariant from 'tiny-invariant'

import {
  useCesium,
  useScreenSpaceEvent,
  useScreenSpaceEventHandler
} from '@takram/plateau-cesium'
import { useWindowEvent } from '@takram/plateau-react-helpers'

import { createGeometry, type GeometryOptions } from './createGeometry'
import { DynamicSketchObject } from './DynamicSketchObject'
import { getExtrudedHeight } from './getExtrudedHeight'
import { pickGround } from './pickGround'
import { sketchMachineAtom } from './states'
import { type SketchFeature, type SketchGeometryType } from './types'

function hasDuplicate(
  controlPoint: Cartesian3,
  controlPoints?: readonly Cartesian3[]
): boolean {
  return (
    controlPoints?.some(another =>
      controlPoint.equalsEpsilon(
        another,
        0,
        1e-7 // Epsilon in radians
      )
    ) === true
  )
}

export interface SketchToolProps {
  type?: SketchGeometryType
  disableInteraction?: boolean
  disableShadow?: boolean
  onCreate?: (feature: SketchFeature) => void
}

const positionScratch = new Cartesian3()

export const SketchTool: FC<SketchToolProps> = ({
  type = 'circle',
  disableInteraction = false,
  disableShadow = false,
  onCreate
}) => {
  const [state, send] = useAtom(sketchMachineAtom)

  const pointerPositionRef = useRef<Cartesian2>()
  const geometryOptionsAtom = useMemo(
    () => atom<GeometryOptions | null>(null),
    []
  )
  const extrudedHeightAtom = useMemo(() => atom(0), [])
  const setGeometryOptions = useSetAtom(geometryOptionsAtom)
  const setExtrudedHeight = useSetAtom(extrudedHeightAtom)

  const createFeature = useSetAtom(
    useMemo(
      () =>
        atom(null, (get, set) => {
          const geometryOptions = get(geometryOptionsAtom)
          const extrudedHeight = get(extrudedHeightAtom)
          if (geometryOptions == null) {
            return null
          }
          const geometry = createGeometry(geometryOptions)
          if (geometry == null || geometry.type === 'LineString') {
            return null
          }
          return feature(geometry, {
            id: nanoid(),
            type: geometryOptions.type,
            positions: geometryOptions.controlPoints.map(
              ({ x, y, z }): [number, number, number] => [x, y, z]
            ),
            extrudedHeight
          })
        }),
      [geometryOptionsAtom, extrudedHeightAtom]
    )
  )

  const scene = useCesium(({ scene }) => scene)

  const updateGeometryOptions = useCallback(
    (controlPoint?: Cartesian3) => {
      setExtrudedHeight(0)
      if (state.context.type == null || state.context.controlPoints == null) {
        setGeometryOptions(null)
        return
      }
      setGeometryOptions({
        type: state.context.type,
        controlPoints:
          controlPoint != null
            ? [...state.context.controlPoints, controlPoint]
            : state.context.controlPoints,
        ellipsoid: scene.globe.ellipsoid
      })
    },
    [state, scene, setGeometryOptions, setExtrudedHeight]
  )

  useWindowEvent('keydown', event => {
    if (disableInteraction) {
      return
    }
    if (event.key === 'Escape') {
      send({ type: 'CANCEL' })
      const controlPoint =
        pointerPositionRef.current != null
          ? pickGround(scene, pointerPositionRef.current, positionScratch)
          : undefined
      updateGeometryOptions(controlPoint)
    }
  })

  const eventHandler = useScreenSpaceEventHandler()

  useScreenSpaceEvent(eventHandler, ScreenSpaceEventType.LEFT_DOWN, event => {
    if (disableInteraction) {
      return
    }
    if (!state.matches('idle')) {
      return
    }
    invariant(state.context.lastControlPoint == null)
    const controlPoint = pickGround(scene, event.position, positionScratch)
    if (controlPoint == null) {
      return
    }
    send({
      type: {
        circle: 'CIRCLE' as const,
        rectangle: 'RECTANGLE' as const,
        polygon: 'POLYGON' as const
      }[type],
      pointerPosition: event.position,
      controlPoint
    })
    setGeometryOptions(null)
  })

  useScreenSpaceEvent(eventHandler, ScreenSpaceEventType.MOUSE_MOVE, event => {
    if (disableInteraction) {
      return
    }
    pointerPositionRef.current = event.endPosition
    if (state.matches('drawing')) {
      invariant(state.context.type != null)
      invariant(state.context.controlPoints != null)
      const controlPoint = pickGround(scene, event.endPosition, positionScratch)
      if (
        controlPoint == null ||
        hasDuplicate(controlPoint, state.context.controlPoints)
      ) {
        return
      }
      updateGeometryOptions(controlPoint)
    } else if (state.matches('extruding')) {
      invariant(state.context.lastControlPoint != null)
      const extrudedHeight = getExtrudedHeight(
        scene,
        state.context.lastControlPoint,
        event.endPosition
      )
      if (extrudedHeight != null) {
        setExtrudedHeight(extrudedHeight)
      }
    }
  })

  useScreenSpaceEvent(eventHandler, ScreenSpaceEventType.LEFT_UP, event => {
    if (disableInteraction) {
      return
    }
    if (
      state.context.controlPoints?.length === 1 &&
      state.context.lastPointerPosition != null &&
      Cartesian2.equalsEpsilon(
        event.position,
        state.context.lastPointerPosition,
        0,
        5 // Epsilon in pixels
      )
    ) {
      return // Too close to the first position user clicked.
    }
    if (state.matches('drawing')) {
      const controlPoint = pickGround(scene, event.position, positionScratch)
      if (
        controlPoint == null ||
        hasDuplicate(controlPoint, state.context.controlPoints)
      ) {
        return
      }
      send({
        type: 'NEXT',
        pointerPosition: event.position,
        controlPoint
      })
    } else if (state.matches('extruding')) {
      const feature = createFeature()
      if (feature == null) {
        return
      }
      onCreate?.(feature)
      send({ type: 'CREATE' })
      setGeometryOptions(null)
    }
  })

  // Manually finish drawing when the user double-clicks.
  useScreenSpaceEvent(
    eventHandler,
    ScreenSpaceEventType.LEFT_DOUBLE_CLICK,
    event => {
      if (disableInteraction) {
        return
      }
      if (state.matches('drawing.polygon')) {
        const controlPoint = pickGround(scene, event.position, positionScratch)
        if (
          controlPoint == null ||
          hasDuplicate(controlPoint, state.context.controlPoints)
        ) {
          return
        }
        send({
          type: 'EXTRUDE',
          pointerPosition: event.position,
          controlPoint
        })
      }
    }
  )

  if (state.matches('idle')) {
    return null
  }
  return (
    <DynamicSketchObject
      geometryOptionsAtom={geometryOptionsAtom}
      {...(state.matches('extruding') && {
        extrudedHeightAtom
      })}
    />
  )
}
