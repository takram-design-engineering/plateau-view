import { atom } from 'jotai'
import { atomWithMachine } from 'jotai-xstate'

import { type SketchGeometryType } from '@takram/plateau-sketch'

import { createToolMachine, type ToolMachineState } from './toolMachine'

export type Tool = 'hand' | 'select' | 'sketch' | 'story' | 'pedestrian'

function matchTool(tool: Tool, machine: ToolMachineState): boolean {
  return (
    machine.matches(`selectedTool.modal.${tool}`) ||
    // @ts-expect-error Ignore strict type
    machine.matches(`selectedTool.momentary.${tool}`) ||
    machine.matches(`activeTool.modal.${tool}`) ||
    // @ts-expect-error Ignore strict type
    machine.matches(`activeTool.momentary.${tool}`)
  )
}

export const toolMachineAtom = atomWithMachine(get => createToolMachine())
export const toolAtom = atom<Tool | null>(get => {
  const machine = get(toolMachineAtom)
  return matchTool('hand', machine)
    ? 'hand'
    : matchTool('select', machine)
    ? 'select'
    : matchTool('sketch', machine)
    ? 'sketch'
    : matchTool('story', machine)
    ? 'story'
    : matchTool('pedestrian', machine)
    ? 'pedestrian'
    : null
})

export const sketchTypeAtom = atom<SketchGeometryType>('circle')
