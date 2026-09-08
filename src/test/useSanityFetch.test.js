import { renderHook, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { useSanityFetch } from '../hooks/useSanityFetch'
import { client } from '../lib/sanity'

vi.mock('../lib/sanity', () => ({
  client: { fetch: vi.fn() },
  queries: {},
}))

describe('useSanityFetch', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns loading true initially', () => {
    client.fetch.mockResolvedValue({ title: 'Test' })
    const { result } = renderHook(() => useSanityFetch('*[_type == "test"]'))
    expect(result.current.loading).toBe(true)
  })

  it('returns fetched data when resolved', async () => {
    client.fetch.mockResolvedValue({ title: 'Hello' })
    const { result } = renderHook(() => useSanityFetch('*[_type == "test"]'))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.data).toEqual({ title: 'Hello' })
    expect(result.current.error).toBeNull()
  })

  it('returns error on fetch failure', async () => {
    client.fetch.mockRejectedValue(new Error('Network error'))
    const { result } = renderHook(() => useSanityFetch('*[_type == "test"]'))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toBeInstanceOf(Error)
    expect(result.current.data).toBeNull()
  })
})
