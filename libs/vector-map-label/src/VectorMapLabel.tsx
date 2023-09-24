import {
  type Globe,
  type ImageryProvider,
  type LabelCollection,
  type Scene
} from '@cesium/engine'
import {
  atom,
  useAtomValue,
  useSetAtom,
  type Atom,
  type SetStateAction
} from 'jotai'
import { fromPairs, uniqBy, xorBy } from 'lodash'
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FC
} from 'react'

import {
  useCesium,
  usePreRender,
  type ImageryLayerHandle
} from '@takram/plateau-cesium'
import { assertType } from '@takram/plateau-type-helpers'

import { makeKey } from './helpers'
import { LabelImagery, type AnnotationStyle } from './LabelImagery'
import { LabelImageryLayer } from './LabelImageryLayer'
import { LabelImageryProvider } from './LabelImageryProvider'
import { type Imagery, type ImageryCoords, type KeyedImagery } from './types'

interface TileImagery {
  readyImagery?: Imagery
}

interface GlobeSurfaceTile {
  imagery: readonly TileImagery[]
}

interface QuadtreeTile {
  data?: GlobeSurfaceTile
}

interface QuadtreePrimitive {
  _tilesToRender: readonly QuadtreeTile[]
}

function getAncestorKeys(coords: ImageryCoords, minLevel: number): string[] {
  if (coords.level === minLevel) {
    return []
  }
  const divisor = 2 ** coords.level
  const x = coords.x / divisor
  const y = coords.y / divisor
  return [...Array(coords.level - minLevel)].map((_, index) => {
    const level = coords.level - (index + 1)
    const scale = 2 ** level
    return makeKey({
      x: Math.floor(x * scale),
      y: Math.floor(y * scale),
      level
    })
  })
}

function isEqualKeys(
  a: readonly KeyedImagery[],
  b?: readonly KeyedImagery[]
): boolean {
  return b != null && a.length === b.length && xorBy(a, b, 'key').length === 0
}

function getImageriesToRender(
  scene: Scene,
  imageryProvider: ImageryProvider
): KeyedImagery[] {
  const globe = scene.globe as Globe & {
    _surface: QuadtreePrimitive
  }

  let minLevel = Infinity
  let maxLevel = -Infinity
  const imageries = uniqBy(
    globe._surface._tilesToRender.flatMap(
      tile =>
        tile.data?.imagery
          .map(imagery => imagery.readyImagery)
          .filter((imagery): imagery is KeyedImagery => {
            if (imagery?.imageryLayer.imageryProvider !== imageryProvider) {
              return false
            }
            assertType<KeyedImagery>(imagery)
            imagery.key = makeKey(imagery)
            if (imagery.level < minLevel) {
              minLevel = imagery.level
            }
            if (imagery.level > maxLevel) {
              maxLevel = imagery.level
            }
            return true
          }) ?? []
    ),
    'key'
  ).sort((a, b) => a.key.localeCompare(b.key))

  if (
    minLevel === maxLevel ||
    minLevel === Infinity ||
    maxLevel === -Infinity
  ) {
    return imageries
  }

  // Populate children and descendants fields.
  const map: Record<
    string,
    {
      imagery: KeyedImagery
      children: KeyedImagery[]
      descendants: KeyedImagery[]
    }
  > = fromPairs(
    imageries.map(imagery => [
      imagery.key,
      {
        imagery,
        children: [],
        descendants: []
      }
    ])
  )
  imageries.forEach(imagery => {
    const ancestorKeys = getAncestorKeys(imagery, minLevel)
    ancestorKeys.forEach(key => {
      const ancestor = map[key]
      if (ancestor != null) {
        ancestor.descendants.push(imagery)
        if (imagery.level - ancestor.imagery.level === 1) {
          ancestor.children.push(imagery)
        }
      }
    })
  })
  Object.values(map).forEach(({ imagery, children, descendants }) => {
    // Maintain object-equality of arrays.
    if (!isEqualKeys(children, imagery.children)) {
      imagery.children = children
    }
    if (!isEqualKeys(descendants, imagery.descendants)) {
      imagery.descendants = descendants
    }
  })

  // Imageries that have 4 children will not be visible.
  return imageries.filter(
    imagery => imagery.children != null && imagery.children.length < 4
  )
}

const LabelImageryCollection: FC<{
  imageryProvider: LabelImageryProvider
  imageriesAtom: Atom<KeyedImagery[]>
  style?: AnnotationStyle
}> = ({ imageryProvider, imageriesAtom, style }) => {
  const imageries = useAtomValue(imageriesAtom)
  return (
    <>
      {imageries.map(imagery => (
        <Suspense key={imagery.key}>
          <LabelImagery
            imageryProvider={imageryProvider}
            imagery={imagery}
            descendants={imagery.descendants}
            style={style}
          />
        </Suspense>
      ))}
    </>
  )
}

export interface VectorMapLabelProps {
  style?: AnnotationStyle
}

export const VectorMapLabel: FC<VectorMapLabelProps> = ({ style }) => {
  const [imageryProvider, setImageryProvider] = useState<LabelImageryProvider>()
  const setRef = useCallback((handle: ImageryLayerHandle | null) => {
    setImageryProvider(
      handle?.imageryLayer.imageryProvider instanceof LabelImageryProvider
        ? handle.imageryLayer.imageryProvider
        : undefined
    )
  }, [])

  const imageriesAtom = useMemo(() => {
    const primitiveAtom = atom<KeyedImagery[]>([])
    return atom(
      get => get(primitiveAtom),
      (get, set, value: SetStateAction<KeyedImagery[]>) => {
        const prevValue = get(primitiveAtom)
        const nextValue = typeof value === 'function' ? value(prevValue) : value
        if (
          prevValue.length !== nextValue.length &&
          xorBy(prevValue, nextValue, 'key').length > 0
        ) {
          set(primitiveAtom, nextValue)
        }
      }
    )
  }, [])

  const setImageries = useSetAtom(imageriesAtom)
  usePreRender(scene => {
    if (imageryProvider == null) {
      return
    }
    const imageries = getImageriesToRender(scene, imageryProvider)
    setImageries(imageries)
  })

  const labels = useCesium(({ labels }) => labels)
  const labelsToUpdateRef = useRef(0)
  usePreRender(scene => {
    assertType<
      LabelCollection & {
        _labelsToUpdate: readonly unknown[]
      }
    >(labels)
    if (labelsToUpdateRef.current !== labels._labelsToUpdate.length) {
      scene.requestRender()
      labelsToUpdateRef.current = labels._labelsToUpdate.length
    }
  })

  const scene = useCesium(({ scene }) => scene)
  useEffect(() => {
    return () => {
      scene.requestRender()
    }
  }, [scene])

  return (
    <>
      <LabelImageryLayer
        ref={setRef}
        url='https://cyberjapandata.gsi.go.jp/xyz/optimal_bvmap-v1/{z}/{x}/{y}.pbf'
        tileWidth={1024}
        tileHeight={1024}
        maximumLevel={17}
        minimumDataLevel={4}
        maximumDataLevel={16}
      />
      {imageryProvider != null && (
        <LabelImageryCollection
          imageryProvider={imageryProvider}
          imageriesAtom={imageriesAtom}
          style={style}
        />
      )}
    </>
  )
}
