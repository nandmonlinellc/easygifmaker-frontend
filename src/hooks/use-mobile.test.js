/**
 * @vitest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react'
import { describe, expect, test, vi, afterEach } from 'vitest'
import { useIsMobile } from './use-mobile'

describe('useIsMobile', () => {
  const originalMatchMedia = window.matchMedia
  const originalInnerWidth = window.innerWidth

  afterEach(() => {
    window.matchMedia = originalMatchMedia
    window.innerWidth = originalInnerWidth
    vi.restoreAllMocks()
  })

  test('returns false/true based on screen width', () => {
    let changeHandler
    const mqlMock = {
      addEventListener: vi.fn((_, cb) => {
        changeHandler = cb
      }),
      removeEventListener: vi.fn(),
    }
    window.matchMedia = vi.fn().mockReturnValue(mqlMock)

    window.innerWidth = 800
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)

    window.innerWidth = 500
    act(() => {
      changeHandler()
    })
    expect(result.current).toBe(true)
  })

  test('cleans up change listener on unmount', () => {
    let changeHandler
    const mqlMock = {
      addEventListener: vi.fn((_, cb) => {
        changeHandler = cb
      }),
      removeEventListener: vi.fn(),
    }
    window.matchMedia = vi.fn().mockReturnValue(mqlMock)

    window.innerWidth = 800
    const { unmount } = renderHook(() => useIsMobile())
    unmount()

    expect(mqlMock.removeEventListener).toHaveBeenCalledWith('change', changeHandler)
  })
})
