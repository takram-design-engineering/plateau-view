import { type Atom } from 'jotai'

export type AtomValue<T> = T extends Atom<infer Value> ? Value : never
