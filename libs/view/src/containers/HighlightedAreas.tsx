import {
  CallbackProperty,
  ClassificationType,
  Color,
  ColorMaterialProperty
} from '@cesium/engine'
import { useTheme } from '@mui/material'
import { animate } from 'framer-motion'
import { type MultiPolygon, type Polygon } from 'geojson'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { useEffect, useMemo, useRef, type FC } from 'react'

import { Entity, useCesium, type EntityProps } from '@takram/plateau-cesium'
import { convertPolygonToHierarchyArray } from '@takram/plateau-cesium-helpers'
import { useAreaGeometryQuery } from '@takram/plateau-graphql'
import { useConstant } from '@takram/plateau-react-helpers'

export interface HighlightAreaOptions {
  areaId: string
  duration?: number // In seconds
}

const optionsArrayAtom = atom<HighlightAreaOptions[]>([])

export const highlightAreaAtom = atom(
  null,
  (get, set, options: HighlightAreaOptions) => {
    set(optionsArrayAtom, prevValue =>
      prevValue.every(({ areaId }) => areaId !== options.areaId)
        ? [...prevValue, options]
        : prevValue
    )
  }
)

const unhighlightAreaAtom = atom(null, (get, set, areaId: string) => {
  set(optionsArrayAtom, prevValue => {
    const nextValue = prevValue.filter(options => options.areaId !== areaId)
    return nextValue.length !== prevValue.length ? nextValue : prevValue
  })
})

const HighlightedArea: FC<{
  areaId: string
  opacity?: number
  duration?: number
}> = ({ areaId, opacity = 0.5, duration = 5 }) => {
  const { data, loading } = useAreaGeometryQuery({
    variables: { areaId }
  })

  const unhighlightArea = useSetAtom(unhighlightAreaAtom)
  useEffect(() => {
    if (!loading && data == null) {
      unhighlightArea(areaId)
    }
  }, [areaId, data, loading, unhighlightArea])

  const theme = useTheme()
  const colorRef = useRef(
    Color.fromCssColorString(theme.palette.primary.main).withAlpha(opacity)
  )
  const colorProperty = useConstant(
    () => new CallbackProperty(() => colorRef.current, false)
  )

  const scene = useCesium(({ scene }) => scene)
  useEffect(() => {
    setTimeout(() => {
      void animate(opacity, 0, {
        duration: 0.5,
        onUpdate: value => {
          colorRef.current = colorRef.current.withAlpha(value)
          scene.requestRender()
        },
        onComplete: () => {
          unhighlightArea(areaId)
        }
      })
    }, duration * 1000)
    return () => {
      scene.requestRender()
    }
  }, [areaId, opacity, duration, unhighlightArea, scene])

  const optionsArray = useMemo((): EntityProps[] | undefined => {
    if (data?.areaGeometry == null) {
      return
    }
    const geometry: Polygon | MultiPolygon = data.areaGeometry.geometry
    const hierarchyArray = convertPolygonToHierarchyArray(geometry)
    const material = new ColorMaterialProperty(colorProperty)
    return hierarchyArray.map(hierarchy => ({
      polygon: {
        hierarchy,
        fill: true,
        material,
        classificationType: ClassificationType.TERRAIN
      }
    }))
  }, [data, colorProperty])

  if (optionsArray == null) {
    return null
  }
  return optionsArray.map((options, index) => (
    <Entity key={index} {...options} />
  ))
}

export const HighlightedAreas: FC = () => {
  const optionsArray = useAtomValue(optionsArrayAtom)
  return (
    <>
      {optionsArray.map(options => (
        <HighlightedArea key={options.areaId} {...options} />
      ))}
    </>
  )
}
