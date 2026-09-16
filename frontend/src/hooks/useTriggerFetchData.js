import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchData } from '../utils/fetchData'

export function useTriggerFetchData() {
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const controllerRef = useRef(null)

  const trigger = useCallback(async (url, options) => {
    controllerRef?.current?.abort()
    const abortController = new AbortController()
    controllerRef.current = abortController

    setIsLoading(true)

    const result = await fetchData(url, { ...options, signal: controllerRef.current.signal })

    if (abortController.signal.aborted) return result

    setIsLoading(false)

    if (result.error) {
      console.error(result.error)
      setError(result.error)
      setData(null)
      return { data: null, error: result.error }
    }

    setError(null)
    setData(result.data)
    return { data: result.data, error: null }
  }, [])

  useEffect(() => () => controllerRef.current?.abort(), [])

  return { error, isLoading, data, trigger }
}
