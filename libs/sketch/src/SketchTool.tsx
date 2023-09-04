import {
  CallbackProperty,
  Cartesian2,
  Cartesian3,
  ScreenSpaceEventType
} from '@cesium/engine'
import { feature } from '@turf/turf'
import { type LineString, type MultiPolygon, type Polygon } from 'geojson'
import { atom, useAtom, useSetAtom } from 'jotai'
import { useCallback, useMemo, useRef, type FC } from 'react'
import invariant from 'tiny-invariant'

import {
  useCesium,
  useScreenSpaceEvent,
  useScreenSpaceEventHandler
} from '@takram/plateau-cesium'
import { useConstant, useWindowEvent } from '@takram/plateau-react-helpers'

import { createGeometry } from './createGeometry'
import { DynamicSketchObject } from './DynamicSketchObject'
import { getExtrudedHeight } from './getExtrudedHeight'
import { pickGround } from './pickGround'
import { sketchMachineAtom } from './states'
import { type SketchFeature, type SketchGeometryType } from './types'

function hasDuplicate(
  position: Cartesian3,
  positions?: readonly Cartesian3[]
): boolean {
  return (
    positions?.some(another =>
      position.equalsEpsilon(
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
  const extrudedHeightRef = useRef<number>(0)
  const extrudedHeightProperty = useConstant(
    () => new CallbackProperty(() => extrudedHeightRef.current, false)
  )

  const geometryAtom = useMemo(
    () => atom<LineString | Polygon | MultiPolygon | null>(null),
    []
  )
  const setGeometry = useSetAtom(geometryAtom)

  const scene = useCesium(({ scene }) => scene)

  const updateGeometryProperties = useCallback(
    (position?: Cartesian3) => {
      if (state.context.type == null || state.context.positions == null) {
        setGeometry(null)
        return
      }
      const geometry = createGeometry({
        type: state.context.type,
        positions:
          position != null
            ? [...state.context.positions, position]
            : state.context.positions,
        ellipsoid: scene.globe.ellipsoid
      })
      setGeometry(geometry ?? null)
    },
    [state, scene, setGeometry]
  )

  useWindowEvent('keydown', event => {
    if (disableInteraction) {
      return
    }
    if (event.key === 'Escape') {
      send({ type: 'CANCEL' })
      const position =
        pointerPositionRef.current != null
          ? pickGround(scene, pointerPositionRef.current, positionScratch)
          : undefined
      updateGeometryProperties(position)
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
    invariant(state.context.lastPosition == null)
    const position = pickGround(scene, event.position, positionScratch)
    if (position == null) {
      return
    }
    send({
      type: {
        circle: 'CIRCLE' as const,
        rectangle: 'RECTANGLE' as const,
        polygon: 'POLYGON' as const
      }[type],
      pointerPosition: event.position,
      position
    })
    setGeometry(null)
    extrudedHeightRef.current = 0
  })

  useScreenSpaceEvent(eventHandler, ScreenSpaceEventType.MOUSE_MOVE, event => {
    if (disableInteraction) {
      return
    }
    pointerPositionRef.current = event.endPosition
    if (state.matches('drawing')) {
      invariant(state.context.type != null)
      invariant(state.context.positions != null)
      const position = pickGround(scene, event.endPosition, positionScratch)
      if (position == null || hasDuplicate(position, state.context.positions)) {
        return
      }
      updateGeometryProperties(position)
    } else if (state.matches('extruding')) {
      invariant(state.context.lastPosition != null)
      const extrudedHeight = getExtrudedHeight(
        scene,
        state.context.lastPosition,
        event.endPosition
      )
      if (extrudedHeight != null) {
        extrudedHeightRef.current = extrudedHeight
        scene.requestRender()
      }
    }
  })

  useScreenSpaceEvent(eventHandler, ScreenSpaceEventType.LEFT_UP, event => {
    if (disableInteraction) {
      return
    }
    if (
      state.context.positions?.length === 1 &&
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
      const position = pickGround(scene, event.position, positionScratch)
      if (position == null || hasDuplicate(position, state.context.positions)) {
        return
      }
      send({
        type: 'NEXT',
        pointerPosition: event.position,
        position
      })
    } else if (state.matches('extruding')) {
      invariant(state.context.type != null)
      invariant(state.context.positions != null)
      const geometry = createGeometry({
        type: state.context.type,
        positions: state.context.positions,
        ellipsoid: scene.globe.ellipsoid
      })
      if (geometry == null || geometry.type === 'LineString') {
        return
      }
      onCreate?.(
        feature(geometry, {
          type: state.context.type,
          positions: state.context.positions.map(({ x, y, z }) => [x, y, z]),
          extrudedHeight: extrudedHeightRef.current
        })
      )
      send({ type: 'CREATE' })
      setGeometry(null)
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
        const position = pickGround(scene, event.position, positionScratch)
        if (
          position == null ||
          hasDuplicate(position, state.context.positions)
        ) {
          return
        }
        send({
          type: 'EXTRUDE',
          pointerPosition: event.position,
          position
        })
      }
    }
  )

  if (state.matches('idle')) {
    return null
  }
  return (
    <DynamicSketchObject
      geometryAtom={geometryAtom}
      {...(state.matches('extruding') && {
        extrudedHeight: extrudedHeightProperty
      })}
    />
  )
}
