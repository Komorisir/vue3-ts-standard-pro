import { describe, expect, it } from 'vitest'
import { isAcceptedImageFile } from './imageFile'

function makeFile(name: string, type: string, size = 8): File {
  return new File([new Uint8Array(size)], name, { type })
}

describe('isAcceptedImageFile', () => {
  it('accepts JPEG, PNG, and WebP by MIME type', () => {
    expect(isAcceptedImageFile(makeFile('a.jpg', 'image/jpeg'))).toBe(true)
    expect(isAcceptedImageFile(makeFile('a.png', 'image/png'))).toBe(true)
    expect(isAcceptedImageFile(makeFile('a.webp', 'image/webp'))).toBe(true)
  })

  it('accepts JPEG/PNG/WebP by extension when MIME is empty', () => {
    expect(isAcceptedImageFile(makeFile('photo.JPEG', ''))).toBe(true)
    expect(isAcceptedImageFile(makeFile('photo.png', ''))).toBe(true)
    expect(isAcceptedImageFile(makeFile('photo.webp', ''))).toBe(true)
  })

  it('rejects empty files and other types', () => {
    expect(isAcceptedImageFile(makeFile('a.png', 'image/png', 0))).toBe(false)
    expect(isAcceptedImageFile(makeFile('notes.txt', 'text/plain'))).toBe(false)
    expect(isAcceptedImageFile(makeFile('anim.gif', 'image/gif'))).toBe(false)
  })
})
