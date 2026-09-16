import { useEffect, useState } from 'react'
import { fetchData } from '../utils/fetchData'

/**
 *
 * @param {string} url
 * @returns {{ data: any, error: Error|null, isLoading: boolean }}
 */
export function useFetchData(url) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const abortController = new AbortController()

    const loadDataFromApi = async () => {
      setIsLoading(true)
      const result = await fetchData(url, {
        signal: abortController.signal,
      })

      if (abortController.signal.aborted) {
        return
      }

      if (result.error) {
        console.error(result.error)
        setError(result.error)
        setData(null)
        setIsLoading(false)
        return
      }

      setError(null)
      setData(result.data)
      setIsLoading(false)
    }

    loadDataFromApi()

    return () => {
      abortController.abort()
    }
  }, [url])

  return { data, error, isLoading }
}
