import escapeStringRegexp from 'escape-string-regexp'

export class ShaderCodeInjector {
  constructor(private source: string) {}

  replace(search: string | string[], code: string): ShaderCodeInjector {
    const pattern = Array.isArray(search)
      ? new RegExp(
          search.map(string => escapeStringRegexp(string)).join('\\s*'),
          'g'
        )
      : new RegExp(escapeStringRegexp(search), 'g')
    const matches = this.source.match(pattern)
    if (matches == null || matches.length === 0) {
      throw new Error(`No matching codes found for: "${search}"`)
    }
    if (matches.length > 1) {
      throw new Error(`Multiple codes found for: "${search}"`)
    }
    this.source = this.source.replace(pattern, code)
    return this
  }

  toString(): string {
    return this.source
  }
}
