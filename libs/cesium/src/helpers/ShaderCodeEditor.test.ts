import { ShaderCodeEditor } from './ShaderCodeEditor'

const source =
  'uniform sampler2D colorTexture;\n' +
  'uniform sampler2D depthTexture;\n' +
  '\n' +
  'void main() {\n' +
  '  vec4 color = texture(colorTexture, v_textureCoordinates);\n' +
  '  out_FragColor = color;\n' +
  '}\n'

describe('ShaderCodeEditor', () => {
  describe('match', () => {
    test('match single code', () => {
      const injector = new ShaderCodeEditor(source)
      const result = injector.match('void main()')
      expect(result.length).toBe(1)
      expect(result[0].index).toBe(65)
      expect(result[0][0]).toBe('void main()')
    })

    test('match multiple codes', () => {
      const injector = new ShaderCodeEditor(source)
      const result = injector.match('uniform sampler2D', true)
      expect(result.length).toBe(2)
      expect(result[0].index).toBe(0)
      expect(result[0][0]).toBe('uniform sampler2D')
      expect(result[1].index).toBe(32)
      expect(result[1][0]).toBe('uniform sampler2D')
    })

    test('throw error when multiple codes found', () => {
      const injector = new ShaderCodeEditor(source)
      expect(() => {
        injector.match('uniform sampler2D')
      }).toThrowError()
    })
  })

  describe('replace', () => {
    test('replace single line', () => {
      const injector = new ShaderCodeEditor(source)
      expect(
        injector
          .replace(
            'vec4 color = texture(colorTexture, v_textureCoordinates);',
            'vec4 color = texture(colorTexture, v_textureCoordinates * 0.5);'
          )
          .toString()
      ).toBe(
        'uniform sampler2D colorTexture;\n' +
          'uniform sampler2D depthTexture;\n' +
          '\n' +
          'void main() {\n' +
          '  vec4 color = texture(colorTexture, v_textureCoordinates * 0.5);\n' +
          '  out_FragColor = color;\n' +
          '}\n'
      )
      expect(
        injector
          .replace(
            'uniform sampler2D colorTexture;',
            'uniform sampler2D colorTexture2;'
          )
          .toString()
      ).toBe(
        'uniform sampler2D colorTexture2;\n' +
          'uniform sampler2D depthTexture;\n' +
          '\n' +
          'void main() {\n' +
          '  vec4 color = texture(colorTexture, v_textureCoordinates * 0.5);\n' +
          '  out_FragColor = color;\n' +
          '}\n'
      )
    })

    test('replace multiple lines', () => {
      const injector = new ShaderCodeEditor(source)
      expect(
        injector.replace('uniform sampler2D', 'uniform vec4', true).toString()
      ).toBe(
        'uniform vec4 colorTexture;\n' +
          'uniform vec4 depthTexture;\n' +
          '\n' +
          'void main() {\n' +
          '  vec4 color = texture(colorTexture, v_textureCoordinates);\n' +
          '  out_FragColor = color;\n' +
          '}\n'
      )
    })
  })

  describe('insertBefore', () => {
    const injector = new ShaderCodeEditor(source)
    expect(
      injector.insertBefore('void main()', 'uniform vec2 uv;').toString()
    ).toBe(
      'uniform sampler2D colorTexture;\n' +
        'uniform sampler2D depthTexture;\n' +
        '\n' +
        'uniform vec2 uv;\n' +
        'void main() {\n' +
        '  vec4 color = texture(colorTexture, v_textureCoordinates);\n' +
        '  out_FragColor = color;\n' +
        '}\n'
    )
  })

  describe('insertAfter', () => {
    const injector = new ShaderCodeEditor(source)
    expect(
      injector
        .insertAfter('uniform sampler2D depthTexture;', 'uniform vec2 uv;')
        .toString()
    ).toBe(
      'uniform sampler2D colorTexture;\n' +
        'uniform sampler2D depthTexture;\n' +
        'uniform vec2 uv;\n' +
        '\n' +
        'void main() {\n' +
        '  vec4 color = texture(colorTexture, v_textureCoordinates);\n' +
        '  out_FragColor = color;\n' +
        '}\n'
    )
  })

  describe('erase', () => {
    const injector = new ShaderCodeEditor(source)
    expect(injector.erase('uniform sampler2D depthTexture;\n').toString()).toBe(
      'uniform sampler2D colorTexture;\n' +
        '\n' +
        'void main() {\n' +
        '  vec4 color = texture(colorTexture, v_textureCoordinates);\n' +
        '  out_FragColor = color;\n' +
        '}\n'
    )
  })
})
