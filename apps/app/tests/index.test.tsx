import { render } from '@testing-library/react'

import Page from '../pages/index'

describe('Index', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Page />)
    expect(baseElement).toBeTruthy()
  })
})
