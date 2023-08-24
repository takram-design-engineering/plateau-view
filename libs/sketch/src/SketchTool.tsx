import {
  CallbackProperty,
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
import { type MultiPolygon, type Polygon } from 'geojson'
import { useAtom } from 'jotai'
import { useMemo, useRef, type FC } from 'react'
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
import { useConstant } from '@takram/plateau-react-helpers'

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

const positionScratch = new Cartesian3()

export const SketchTool: FC<SketchToolProps> = ({
  type = 'circle',
  disableShadow = false,
  onCreate
}) => {
  const [state, send] = useAtom(sketchMachineAtom)

  const geometryRef = useRef<Polygon | MultiPolygon>()
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

  const eventHandler = useScreenSpaceEventHandler()
  const scene = useCesium(({ scene }) => scene)

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
      position
    })
    geometryRef.current = undefined
    positionsRef.current = undefined
    hierarchyRef.current = undefined
    extrudedHeightRef.current = 0
  })

  useScreenSpaceEvent(eventHandler, ScreenSpaceEventType.MOUSE_MOVE, event => {
    if (state.matches('drawing')) {
      invariant(state.context.type != null)
      invariant(state.context.positions != null)
      const position = pickGround(scene, event.endPosition, positionScratch)
      if (position == null) {
        return
      }
      if (position.equalsEpsilon(state.context.lastPosition)) {
        return
      }
      const geometry = createGeometry(
        state.context.type,
        state.context.positions,
        position,
        scene.globe.ellipsoid
      )
      if (geometry == null) {
        return
      }
      if (geometry.type === 'LineString') {
        positionsRef.current = convertGeometryToPositionsArray(geometry)[0]
        hierarchyRef.current = undefined
      } else {
        geometryRef.current = geometry
        positionsRef.current = undefined
        hierarchyRef.current = convertPolygonToHierarchyArray(geometry)[0]
      }
      scene.requestRender()
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
    if (state.matches('drawing')) {
      const position = pickGround(scene, event.position, positionScratch)
      if (position == null) {
        return
      }
      if (position.equalsEpsilon(state.context.lastPosition)) {
        return
      }
      send({ type: 'NEXT', position })
    } else if (state.matches('extruding')) {
      invariant(state.context.type != null)
      invariant(state.context.positions != null)
      invariant(geometryRef.current != null)
      onCreate?.(
        feature(geometryRef.current, {
          type: state.context.type,
          positions: state.context.positions.map(({ x, y, z }) => [x, y, z]),
          extrudedHeight: extrudedHeightRef.current
        })
      )
      send({ type: 'CREATE' })
    }
  })

  useScreenSpaceEvent(
    eventHandler,
    ScreenSpaceEventType.LEFT_DOUBLE_CLICK,
    event => {
      if (state.matches('drawing.polygon')) {
        const position = pickGround(scene, event.position, positionScratch)
        if (position == null) {
          return
        }
        if (position.equalsEpsilon(state.context.lastPosition)) {
          return
        }
        send({ type: 'EXTRUDE', position })
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
