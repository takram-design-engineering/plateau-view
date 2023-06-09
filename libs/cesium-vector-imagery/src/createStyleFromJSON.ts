import { json_style } from 'protomaps'
import { type JsonObject } from 'type-fest'

export interface FontSub {
  face: string
  weight?: number
  style?: string
}

export interface MapStyle {
  paintRules: ReturnType<typeof json_style>['paint_rules']
  labelRules: ReturnType<typeof json_style>['label_rules']
}

export function createStyleFromJSON(
  data: string | JsonObject, // TODO: Refine type
  fontSubMap = new Map<string, FontSub>()
): MapStyle {
  if (typeof json_style !== 'function') {
    return {
      paintRules: [],
      labelRules: []
    }
  }
  const style = json_style(
    typeof data === 'string' ? JSON.parse(data) : data,
    fontSubMap
  )
  return {
    paintRules: style.paint_rules,
    labelRules: style.label_rules
  }
}
