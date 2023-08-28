import { atom } from 'jotai'
import { atomWithMachine } from 'jotai-xstate'

import { type SketchGeometryType } from '@takram/plateau-sketch'

import { createToolMachine, type ToolMachineState } from './toolMachine'

export type ToolType = 'hand' | 'select' | 'sketch' | 'story' | 'pedestrian'

export interface Tool {
  type: ToolType
  active: boolean
}

function matchModal(tool: ToolType, machine: ToolMachineState): boolean {
  return (
    machine.matches(`modal.selected.${tool}`) ||
    machine.matches(`modal.active.${tool}`)
  )
}

function matchMomentary(
  tool: 'hand' | 'select',
  machine: ToolMachineState
): boolean {
  return (
    machine.matches(`momentary.selected.${tool}`) ||
    machine.matches(`momentary.active.${tool}`)
  )
}

export function getModalTool(state: ToolMachineState): Tool | undefined {
  const modal = matchModal('hand', state)
    ? 'hand'
    : matchModal('select', state)
    ? 'select'
    : matchModal('sketch', state)
    ? 'sketch'
    : matchModal('story', state)
    ? 'story'
    : matchModal('pedestrian', state)
    ? 'pedestrian'
    : undefined
  return modal != null
    ? {
        type: modal,
        active: state.matches('modal.active')
      }
    : undefined
}

export function getMomentaryTool(state: ToolMachineState): Tool | undefined {
  const momentary = matchMomentary('hand', state)
    ? 'hand'
    : matchMomentary('select', state)
    ? 'select'
    : undefined
  return momentary != null
    ? {
        type: momentary,
        active: state.matches('momentary.active')
      }
    : undefined
}

export function getTool(state: ToolMachineState): Tool | undefined {
  return getMomentaryTool(state) ?? getModalTool(state)
}

export const toolMachineAtom = atomWithMachine(get => createToolMachine())
export const toolAtom = atom<Tool | null>(
  get => getTool(get(toolMachineAtom)) ?? null
)
export const modalToolAtom = atom<Tool | null>(
  get => getModalTool(get(toolMachineAtom)) ?? null
)
export const momentaryToolAtom = atom<Tool | null>(
  get => getMomentaryTool(get(toolMachineAtom)) ?? null
)

export const sketchTypeAtom = atom<SketchGeometryType>('circle')
