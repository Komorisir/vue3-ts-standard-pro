import { describe, expect, it } from 'vitest'
import { createCommandStack, type EditorCommand } from './commandStack'

function makeCommand(log: string[], name: string): EditorCommand {
  return {
    execute() {
      log.push(`do:${name}`)
    },
    undo() {
      log.push(`undo:${name}`)
    },
    redo() {
      log.push(`redo:${name}`)
    },
  }
}

describe('createCommandStack', () => {
  it('pushes, undoes, and redoes sequential commands', () => {
    const log: string[] = []
    const stack = createCommandStack()

    stack.push(makeCommand(log, 'a'))
    stack.push(makeCommand(log, 'b'))
    stack.undo()
    stack.undo()
    stack.redo()
    stack.redo()

    expect(log).toEqual(['do:a', 'do:b', 'undo:b', 'undo:a', 'redo:a', 'redo:b'])
  })

  it('restores rotation and flip state through undo redo', () => {
    const state = { rotation: 0, flipX: false }
    const stack = createCommandStack()

    stack.push({
      execute() {
        state.rotation = 90
      },
      undo() {
        state.rotation = 0
      },
      redo() {
        state.rotation = 90
      },
    })
    stack.push({
      execute() {
        state.flipX = true
      },
      undo() {
        state.flipX = false
      },
      redo() {
        state.flipX = true
      },
    })

    stack.undo()
    expect(state).toEqual({ rotation: 90, flipX: false })
    stack.undo()
    expect(state).toEqual({ rotation: 0, flipX: false })
    stack.redo()
    expect(state).toEqual({ rotation: 90, flipX: false })
    stack.redo()
    expect(state).toEqual({ rotation: 90, flipX: true })
  })
})
