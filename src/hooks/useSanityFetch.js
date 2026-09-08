import { useState, useEffect } from 'react'
import { client } from '../lib/sanity'

export function useSanityFetch(query) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!query) return
    setLoading(true)
    client
      .fetch(query)
      .then(result => { setData(result); setLoading(false) })
      .catch(err => { setError(err); setLoading(false) })
  }, [query])

  return { data, loading, error }
}
