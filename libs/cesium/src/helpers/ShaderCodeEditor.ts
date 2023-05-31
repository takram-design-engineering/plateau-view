import escapeStringRegexp from 'escape-string-regexp'
import { type SetRequired } from 'type-fest'

export class ShaderCodeEditor {
  constructor(private source: string) {}

  match(
    search: string | string[],
    multiple = false
  ): Array<SetRequired<RegExpMatchArray, 'index'>> {
    const pattern = Array.isArray(search)
      ? new RegExp(
          search.map(string => escapeStringRegexp(string)).join('\\s*'),
          'g'
        )
      : new RegExp(escapeStringRegexp(search), 'g')

    const matches = [...this.source.matchAll(pattern)].filter(
      (match): match is SetRequired<RegExpMatchArray, 'index'> =>
        match.index != null
    )
    if (matches == null || matches.length === 0) {
      throw new Error(`No matching codes found for: "${search}"`)
    }
    if (!multiple && matches.length > 1) {
      throw new Error(`Multiple codes found for: "${search}"`)
    }
    return matches
  }

  replace(search: string | string[], code: string, multiple = false): this {
    const matches = this.match(search, multiple)
    const indices = [
      0,
      ...matches.flatMap(match => [match.index, match.index + match[0].length]),
      this.source.length
    ]
    const chunks: string[] = []
    indices.reduce((start, end, index) => {
      chunks.push(
        matches[(index - 2) / 2] != null ? code : this.source.slice(start, end)
      )
      return end
    }, 0)
    this.source = chunks.join('')
    return this
  }

  insertBefore(
    search: string | string[],
    code: string,
    multiple?: boolean
  ): this {
    const matches = this.match(search, multiple)
    const indices = [
      0,
      ...matches.flatMap(match => [match.index, match.index + match[0].length]),
      this.source.length
    ]
    const chunks: string[] = []
    indices.reduce((start, end, index) => {
      const chunk = this.source.slice(start, end)
      chunks.push(
        matches[(index - 2) / 2] != null ? `${code}\n${chunk}` : chunk
      )
      return end
    }, 0)
    this.source = chunks.join('')
    return this
  }

  insertAfter(
    search: string | string[],
    code: string,
    multiple?: boolean
  ): this {
    const matches = this.match(search, multiple)
    const indices = [
      0,
      ...matches.flatMap(match => [match.index, match.index + match[0].length]),
      this.source.length
    ]
    const chunks: string[] = []
    indices.reduce((start, end, index) => {
      const chunk = this.source.slice(start, end)
      chunks.push(
        matches[(index - 2) / 2] != null ? `${chunk}\n${code}` : chunk
      )
      return end
    }, 0)
    this.source = chunks.join('')
    return this
  }

  erase(search: string | string[], multiple?: boolean): this {
    return this.replace(search, '', multiple)
  }

  toString(): string {
    return this.source
  }
}
