import {
  ClassificationType,
  EllipsoidSurfaceAppearance,
  GeometryInstance,
  GroundPrimitive,
  PolygonGeometry
} from '@cesium/engine'
import { type MultiPolygon, type Polygon } from 'geojson'
import { pick } from 'lodash'
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

import { useCesium } from '@takram/plateau-cesium'
import { convertPolygonToHierarchyArray } from '@takram/plateau-cesium-helpers'
import { colorMapViridis } from '@takram/plateau-color-maps'
import { useConstant } from '@takram/plateau-react-helpers'

import { type MeshImageData } from './createMeshImageData'
import {
  HeatmapMeshMaterial,
  type HeatmapMeshMaterialOptions
} from './HeatmapMeshMaterial'

export interface HeatmapMeshHandle {
  bringToFront: () => void
  sendToBack: () => void
}

export interface HeatmapMeshProps
  extends Omit<
    HeatmapMeshMaterialOptions,
    'image' | 'width' | 'height' | 'rectangle' | 'cropRectangle'
  > {
  meshImageData: MeshImageData
  geometry: Polygon | MultiPolygon
}

export const HeatmapMesh = forwardRef<HeatmapMeshHandle, HeatmapMeshProps>(
  ({ meshImageData, geometry, colorMap, ...props }, ref) => {
    const scene = useCesium(({ scene }) => scene)
    const groundPrimitives = scene.groundPrimitives
    const primitivesRef = useRef<GroundPrimitive[]>()

    const material = useConstant(
      () =>
        new HeatmapMeshMaterial({
          image: meshImageData.image,
          width: meshImageData.width,
          height: meshImageData.height
        })
    )

    useEffect(() => {
      if (groundPrimitives.isDestroyed()) {
        return
      }
      const primitives = convertPolygonToHierarchyArray(geometry).map(
        polygonHierarchy => {
          const instance = new GeometryInstance({
            geometry: new PolygonGeometry({
              polygonHierarchy,
              vertexFormat: EllipsoidSurfaceAppearance.VERTEX_FORMAT
            })
          })
          return new GroundPrimitive({
            geometryInstances: instance,
            classificationType: ClassificationType.BOTH,
            appearance: new EllipsoidSurfaceAppearance({
              material
            })
          })
        }
      )
      primitives.forEach(primitive => {
        groundPrimitives.add(primitive)
      })
      primitivesRef.current = primitives
      return () => {
        if (!groundPrimitives.isDestroyed()) {
          primitives.forEach(primitive => {
            groundPrimitives.remove(primitive)
          })
        }
        primitivesRef.current = undefined
      }
    }, [meshImageData, geometry, groundPrimitives, material])

    useEffect(() => {
      material.uniforms.colorMap =
        colorMap != null
          ? colorMap.createImage()
          : colorMapViridis.createImage()
    }, [colorMap, material])

    Object.assign(
      material.uniforms,
      pick(props, [
        'minValue',
        'maxValue',
        'alpha',
        'contourSpacing',
        'contourThickness',
        'contourAlpha',
        'logarithmic'
      ])
    )

    useImperativeHandle(
      ref,
      () => ({
        bringToFront: () => {
          if (groundPrimitives.isDestroyed()) {
            return
          }
          primitivesRef.current?.forEach(primitive => {
            if (groundPrimitives.contains(primitive)) {
              groundPrimitives.raiseToTop(primitive)
            }
          })
        },
        sendToBack: () => {
          if (groundPrimitives.isDestroyed()) {
            return
          }
          primitivesRef.current?.forEach(primitive => {
            if (groundPrimitives.contains(primitive)) {
              groundPrimitives.lowerToBottom(primitive)
            }
          })
        }
      }),
      [groundPrimitives]
    )

    scene.requestRender()
    return null
  }
)
