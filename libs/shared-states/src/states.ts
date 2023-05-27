import { atom } from 'jotai'
import { atomWithReset } from 'jotai/utils'

export type Platform = 'mac' | 'windows' | 'other'
export const platformAtom = atom<Platform | null>(null)

export type ColorMode = 'light' | 'dark'
export const colorModeAtom = atomWithReset<ColorMode>('light')
