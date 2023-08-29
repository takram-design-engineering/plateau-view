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
import { uniqBy, xorBy } from 'lodash'
import {
  Suspense,
  useCallback,
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

import { LabelImagery } from './LabelImagery'
import { LabelImageryLayer } from './LabelImageryLayer'
import { LabelImageryProvider } from './LabelImageryProvider'
import { type Imagery, type KeyedImagery } from './types'

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

type Coords = Pick<Imagery, 'x' | 'y' | 'level'>

function makeKey({ x, y, level }: Coords): string {
  return `${level}:${x}:${y}`
}

function getAncestorKeys(coords: Coords, minLevel: number): string[] {
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

  // Exclude imageries contained by another imagery.
  const keys = new Set(imageries.map(({ key }) => key))
  return imageries.filter(imagery => {
    const ancestors = getAncestorKeys(imagery, minLevel)
    return ancestors.every(key => !keys.has(key))
  })
}

const LabelImageryCollection: FC<{
  imageryProvider: LabelImageryProvider
  imageriesAtom: Atom<KeyedImagery[]>
}> = ({ imageryProvider, imageriesAtom }) => {
  const imageries = useAtomValue(imageriesAtom)
  return (
    <>
      {imageries.map(imagery => (
        <Suspense key={imagery.key}>
          <LabelImagery imageryProvider={imageryProvider} imagery={imagery} />
        </Suspense>
      ))}
    </>
  )
}

export const VectorMapLabel: FC = () => {
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

  return (
    <>
      <LabelImageryLayer
        ref={setRef}
        url='https://cyberjapandata.gsi.go.jp/xyz/optimal_bvmap-v1/{z}/{x}/{y}.pbf'
        minimumDataLevel={4}
        maximumLevel={16}
      />
      {imageryProvider != null && (
        <LabelImageryCollection
          imageryProvider={imageryProvider}
          imageriesAtom={imageriesAtom}
        />
      )}
    </>
  )
}
