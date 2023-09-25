import { type RequireAtLeastOne } from 'type-fest'

export type IdentifierParam = string | number | { toString: () => string }

export interface IdentifierParams {
  type: IdentifierParam
  subtype?: IdentifierParam
  key: IdentifierParam
  index?: number
}

export function composeIdentifier({
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

export function parseIdentifier(identifier: string): ParsedIdentifierParams {
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

export function matchIdentifier(
  identifier: string,
  params: RequireAtLeastOne<IdentifierParams>
): boolean {
  const { type, subtype, key, index } = parseIdentifier(identifier)
  return (
    (params.type == null || `${params.type}` === type) &&
    (params.subtype == null || `${params.subtype}` === subtype) &&
    (params.key == null || `${params.key}` === key) &&
    (params.index == null || params.index === index)
  )
}
