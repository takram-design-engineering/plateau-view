import {
  CallbackProperty,
  Math as CesiumMath,
  type Cartesian3,
  type PolygonHierarchy
} from '@cesium/engine'
import { ellipse } from '@turf/turf'
import { useAtomValue, useSetAtom } from 'jotai'
import { nanoid } from 'nanoid'
import { useContext, useEffect, useRef } from 'react'
import invariant from 'tiny-invariant'
import { type SetOptional } from 'type-fest'

import { useCesium } from '@plateau/cesium'
import {
  convertPolygonToHierarchyArray,
  convertPolygonToPositionsArray
} from '@plateau/cesium-helpers'
import { useConstant } from '@plateau/react-helpers'

import { SketchContext, type GeometryFeature } from './SketchProvider'
import { useScreenSpaceDrag } from './useScreenSpaceDrag'

export interface DrawingToolResult {
  polygonHierarchyProperty?: CallbackProperty
  polylinePositionsProperty?: CallbackProperty
}

export function useDrawingTool(): DrawingToolResult {
  const { stateAtom, featureAtomsAtom } = useContext(SketchContext)
  const state = useAtomValue(stateAtom)
  const dispatch = useSetAtom(featureAtomsAtom)

  const scene = useCesium(({ scene }) => scene)
  const featureRef = useRef<SetOptional<GeometryFeature, 'id'>>()
  const hierarchyRef = useRef<PolygonHierarchy>()
  const polygonHierarchyProperty = useConstant(
    () => new CallbackProperty(() => hierarchyRef.current, false)
  )
  const positionsRef = useRef<Cartesian3[]>()
  const polylinePositionsProperty = useConstant(
    () => new CallbackProperty(() => positionsRef.current, false)
  )

  const active = state.matches('activeTool.modal.drawing')

  useEffect(() => {
    if (!active && featureRef.current != null) {
      invariant(hierarchyRef.current != null)
      dispatch({
        type: 'insert',
        value: {
          ...featureRef.current,
          id: nanoid()
        }
      })
      featureRef.current = undefined
      hierarchyRef.current = undefined
      positionsRef.current = undefined
    }
  }, [dispatch, active])

  useScreenSpaceDrag(
    ({ cartographicStart: { longitude, latitude }, distance }) => {
      if (!active || distance === 0) {
        return
      }
      const feature = ellipse(
        [CesiumMath.toDegrees(longitude), CesiumMath.toDegrees(latitude)],
        distance,
        distance,
        { units: 'meters' }
      )
      featureRef.current = feature
      hierarchyRef.current = convertPolygonToHierarchyArray(feature.geometry)[0]
      positionsRef.current = convertPolygonToPositionsArray(feature.geometry)[0]
      scene.requestRender()
    }
  )

  return active
    ? {
        polygonHierarchyProperty,
        polylinePositionsProperty
      }
    : {}
}
