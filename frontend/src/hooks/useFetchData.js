import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchData } from '../utils/fetchData'

export function useFetchData(url) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const abortController = useRef(null)

  const loadDataFromApi = useCallback(async () => {
    abortController.current?.abort() // Abort any ongoing request before starting a new one

    const controller = new AbortController()
    abortController.current = controller
    setIsLoading(true)

    const result = await fetchData(url, {
      signal: controller.signal,
    })

    // If the request was aborted, do not update state
    if (controller.signal.aborted) {
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
  }, [url])

  useEffect(() => {
    loadDataFromApi()

    return () => {
      abortController.current?.abort()
    }
  }, [loadDataFromApi])

  const refetch = useCallback(async () => await loadDataFromApi(), [loadDataFromApi])

  return { data, error, isLoading, refetch }
}
