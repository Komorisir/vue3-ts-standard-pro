import { describe, expect, it } from 'vitest'
import { routes } from './routes'

function findRoute(path: string) {
  return routes.find(route => route.path === path)
}

describe('routes', () => {
  it('redirects the root path to /editor', () => {
    expect(findRoute('/')?.redirect).toBe('/editor')
  })

  it('exposes /editor as a named page route', () => {
    const editor = findRoute('/editor')
    expect(editor?.name).toBe('editor')
    expect(editor?.redirect).toBeUndefined()
    expect(editor?.component).toBeDefined()
  })

  it('redirects unknown paths to /editor', () => {
    const catchAll = routes.find(route => String(route.path).includes(':pathMatch'))
    expect(catchAll?.redirect).toBe('/editor')
  })
})
