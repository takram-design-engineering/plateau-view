import {
  CallbackProperty,
  Cartesian2,
  Cartesian3,
  ClassificationType,
  Color,
  HeightReference,
  ScreenSpaceEventType,
  ShadowMode,
  type PolygonHierarchy
} from '@cesium/engine'
import { useTheme } from '@mui/material'
import { feature } from '@turf/turf'
import { useAtom } from 'jotai'
import { useCallback, useMemo, useRef, type FC } from 'react'
import invariant from 'tiny-invariant'

import {
  Entity,
  useCesium,
  useScreenSpaceEvent,
  useScreenSpaceEventHandler,
  type EntityProps
} from '@takram/plateau-cesium'
import {
  convertGeometryToPositionsArray,
  convertPolygonToHierarchyArray
} from '@takram/plateau-cesium-helpers'
import { useConstant, useWindowEvent } from '@takram/plateau-react-helpers'

import { createGeometry } from './createGeometry'
import { getExtrudedHeight } from './getExtrudedHeight'
import { pickGround } from './pickGround'
import { sketchMachineAtom } from './states'
import { type GeometryType, type SketchFeature } from './types'

export interface SketchToolProps {
  type?: GeometryType
  disableShadow?: boolean
  onCreate?: (feature: SketchFeature) => void
}

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

const positionScratch = new Cartesian3()

export const SketchTool: FC<SketchToolProps> = ({
  type = 'circle',
  disableShadow = false,
  onCreate
}) => {
  const [state, send] = useAtom(sketchMachineAtom)

  const pointerPositionRef = useRef<Cartesian2>()
  const positionsRef = useRef<Cartesian3[]>()
  const polylinePositionsProperty = useConstant(
    () => new CallbackProperty(() => positionsRef.current, false)
  )
  const hierarchyRef = useRef<PolygonHierarchy>()
  const polygonHierarchyProperty = useConstant(
    () => new CallbackProperty(() => hierarchyRef.current, false)
  )
  const extrudedHeightRef = useRef<number>(0)
  const extrudedHeightProperty = useConstant(
    () => new CallbackProperty(() => extrudedHeightRef.current, false)
  )

  const scene = useCesium(({ scene }) => scene)

  const updateGeometryProperties = useCallback(
    (position?: Cartesian3) => {
      if (state.context.type == null || state.context.positions == null) {
        positionsRef.current = undefined
        hierarchyRef.current = undefined
        return
      }
      const geometry = createGeometry(
        state.context.type,
        position != null
          ? [...state.context.positions, position]
          : state.context.positions,
        scene.globe.ellipsoid
      )
      if (geometry == null) {
        return
      }
      if (geometry.type === 'LineString') {
        positionsRef.current = convertGeometryToPositionsArray(geometry)[0]
        hierarchyRef.current = undefined
      } else {
        positionsRef.current = convertGeometryToPositionsArray(geometry)[0]
        hierarchyRef.current = convertPolygonToHierarchyArray(geometry)[0]
      }
      scene.requestRender()
    },
    [state, scene]
  )

  useWindowEvent('keydown', event => {
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
    positionsRef.current = undefined
    hierarchyRef.current = undefined
    extrudedHeightRef.current = 0
  })

  useScreenSpaceEvent(eventHandler, ScreenSpaceEventType.MOUSE_MOVE, event => {
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
      const geometry = createGeometry(
        state.context.type,
        state.context.positions,
        scene.globe.ellipsoid
      )
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
    }
  })

  // Manually finish drawing when the user double-clicks.
  useScreenSpaceEvent(
    eventHandler,
    ScreenSpaceEventType.LEFT_DOUBLE_CLICK,
    event => {
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

  const theme = useTheme()
  const primaryColor = useMemo(
    () => Color.fromCssColorString(theme.palette.primary.main),
    [theme]
  )

  const entityOptions = useMemo(
    (): EntityProps | undefined =>
      !state.matches('idle')
        ? {
            polyline: {
              positions: polylinePositionsProperty,
              width: 1.5,
              material: primaryColor,
              classificationType: ClassificationType.TERRAIN,
              clampToGround: true
            },
            polygon: {
              hierarchy: polygonHierarchyProperty,
              fill: true,
              material: primaryColor.withAlpha(0.5),
              classificationType: ClassificationType.TERRAIN
            }
          }
        : undefined,
    [state, polylinePositionsProperty, polygonHierarchyProperty, primaryColor]
  )

  const extrudedEntityOptions = useMemo(
    (): EntityProps | undefined =>
      state.matches('extruding')
        ? {
            polygon: {
              hierarchy: polygonHierarchyProperty,
              extrudedHeight: extrudedHeightProperty,
              extrudedHeightReference: HeightReference.RELATIVE_TO_GROUND,
              fill: true,
              material: primaryColor,
              shadows: disableShadow ? ShadowMode.DISABLED : ShadowMode.ENABLED
            }
          }
        : undefined,
    [
      disableShadow,
      state,
      polygonHierarchyProperty,
      extrudedHeightProperty,
      primaryColor
    ]
  )

  if (state.matches('idle')) {
    return null
  }
  return (
    <>
      {entityOptions != null && <Entity {...entityOptions} />}
      {extrudedEntityOptions != null && <Entity {...extrudedEntityOptions} />}
    </>
  )
}
