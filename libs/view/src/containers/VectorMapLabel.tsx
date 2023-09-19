import { Color } from '@cesium/engine'
import { useAtomValue } from 'jotai'
import { mapValues } from 'lodash'
import dynamic from 'next/dynamic'
import { Suspense, useMemo, type FC } from 'react'

import { colorModeAtom, type ColorMode } from '@takram/plateau-shared-states'
import type {
  AnnotationStyle,
  AnnotationType
} from '@takram/plateau-vector-map-label'

import { showMapLabelAtom } from '../states/app'

const VectorMapLabel = dynamic(
  async () => (await import('@takram/plateau-vector-map-label')).VectorMapLabel,
  { ssr: false }
)

const styleOverrides: Record<ColorMode, AnnotationStyle> = {
  light: {
    default: {
      fillColor: Color.BLACK,
      outlineColor: Color.WHITE.withAlpha(0.8)
    },
    towns: {
      fillColor: Color.BLACK.withAlpha(0.6)
    },
    topography: {
      fillColor: Color.BLACK.withAlpha(0.6)
    }
  },
  dark: {
    default: {
      fillColor: Color.WHITE,
      outlineColor: Color.BLACK.withAlpha(0.8)
    },
    towns: {
      fillColor: Color.WHITE.withAlpha(0.6)
    },
    topography: {
      fillColor: Color.WHITE.withAlpha(0.6)
    }
  }
}

export const MapLabel: FC = () => {
  const showMapLabel = useAtomValue(showMapLabelAtom)
  const colorMode = useAtomValue(colorModeAtom)
  const style = useMemo(
    () => ({
      ...mapValues(
        showMapLabel,
        (value, key) =>
          value && styleOverrides[colorMode][key as AnnotationType]
      ),
      default: styleOverrides[colorMode].default
    }),
    [showMapLabel, colorMode]
  )
  return (
    Object.values(showMapLabel).some(value => value) && (
      <Suspense>
        <VectorMapLabel style={style} />
      </Suspense>
    )
  )
}
