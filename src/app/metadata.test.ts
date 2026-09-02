import { metadata } from './metadata'

describe('metadata', () => {
  it('has the correct title', () => {
    expect(metadata.title).toBe('Todo App — Frontend Demo')
  })

  it('has the correct description', () => {
    expect(metadata.description).toBe('Create, filter, sort and edit tasks in a React and Redux demo. No account needed; tasks reset on reload.')
  })
}) 