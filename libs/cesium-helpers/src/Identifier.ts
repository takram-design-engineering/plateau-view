import { type RequireAtLeastOne } from 'type-fest'

export type IdentifierParam = string | number | { toString: () => string }

export interface IdentifierParams {
  type: IdentifierParam
  subtype?: IdentifierParam
  key: IdentifierParam
  index?: number
}

export function compose({
  type,
  subtype,
  key,
  index
}: IdentifierParams): string {
  return [type, subtype, key, index]
    .map(value => (value != null ? `${value}` : undefined))
    .join(':')
}

export interface ParsedIdentifierParams {
  type?: string
  subtype?: string
  key?: string
  index?: number
}

export function parse(identifier: string): ParsedIdentifierParams {
  const components = identifier.split(':')
  if (components.length !== 4) {
    console.warn(`Malformed identifier: ${identifier}`)
    return {}
  }
  const [type, subtype, key, index] = components.map(value =>
    value !== '' ? value : undefined
  )
  return { type, subtype, key, index: index != null ? +index : undefined }
}

export function match(
  identifier: string,
  params: RequireAtLeastOne<IdentifierParams>
): boolean {
  const { type, subtype, key, index } = parse(identifier)
  return (
    (params.type == null || `${params.type}` === type) &&
    (params.subtype == null || `${params.subtype}` === subtype) &&
    (params.key == null || `${params.key}` === key) &&
    (params.index == null || params.index === index)
  )
}
