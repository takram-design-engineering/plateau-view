import { Math as CesiumMath, Rectangle } from '@cesium/engine'
import { CanceledError } from 'axios'
import useAxios from 'axios-hooks'
import type { SourceVectorLayer } from 'mapbox-gl'
import { useEffect, useMemo } from 'react'

interface MVTMetadata {
  minimumZoom: number
  maximumZoom: number
  rectangle: Rectangle
  sourceLayers: SourceVectorLayer[]
}

export function useMVTMetadata(url?: string): MVTMetadata | undefined {
  const [{ data }, fetch] = useAxios(
    { url: url?.replace('{z}/{x}/{y}.mvt', 'metadata.json') },
    { manual: true }
  )

  useEffect(() => {
    if (url != null) {
      fetch().catch(error => {
        if (!(error instanceof CanceledError)) {
          console.error(error)
        }
      })
    }
  }, [url, fetch])

  return useMemo((): MVTMetadata | undefined => {
    if (data == null) {
      return
    }
    // TODO: Is there any documentation of this JSON structure?
    try {
      const bounds = data.bounds
        .split(',')
        .map((value: string) => CesiumMath.toRadians(+value))
      const rectangle = new Rectangle(...bounds)
      const json = JSON.parse(data.json)
      return {
        minimumZoom: data.minzoom,
        maximumZoom: data.maxzoom,
        rectangle,
        sourceLayers: json.vector_layers
      }
    } catch (error) {
      console.error('Failed to parse MVT metadata:', data)
    }
  }, [data])
}
