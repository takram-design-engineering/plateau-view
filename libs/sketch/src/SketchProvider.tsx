import { type PolygonHierarchy } from '@cesium/engine'
import { type Feature, type MultiPolygon, type Polygon } from 'geojson'
import { atom, type PrimitiveAtom } from 'jotai'
import { atomWithMachine } from 'jotai-xstate'
import { splitAtom } from 'jotai/utils'
import { createContext, useMemo, type FC, type ReactNode } from 'react'
import { type SetRequired } from 'type-fest'

import { sketchStateMachine } from './sketchStateMachine'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const splitAtomType = <T,>() => splitAtom(atom<T[]>([]))
type SplitAtom<T> = ReturnType<typeof splitAtomType<T>>

export type SketchTool = 'select' | 'hand'

export type GeometryFeature = SetRequired<Feature<Polygon | MultiPolygon>, 'id'>

export interface SketchState {
  stateAtom: ReturnType<typeof atomWithMachine<typeof sketchStateMachine>>
  featuresAtom: PrimitiveAtom<GeometryFeature[]>
  featureAtomsAtom: SplitAtom<GeometryFeature>
  polygonHierarchyAtom: PrimitiveAtom<PolygonHierarchy | null>
}

function createSketchState(): SketchState {
  const featuresAtom = atom<GeometryFeature[]>([])
  const featureAtomsAtom = splitAtom(featuresAtom)
  return {
    stateAtom: atomWithMachine(sketchStateMachine),
    featuresAtom,
    featureAtomsAtom,
    polygonHierarchyAtom: atom<PolygonHierarchy | null>(null)
  }
}

export const SketchContext = createContext(createSketchState())

export interface SketchProviderProps {
  children?: ReactNode
}

export const SketchProvider: FC<SketchProviderProps> = props => {
  const stateAtom = useMemo(() => createSketchState(), [])
  return <SketchContext.Provider {...props} value={stateAtom} />
}
