import { useState, useRef, useCallback, useEffect } from 'react'

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Reusable hook to start a background task and poll until it finishes.
 *
 * @param {Object} options
 * @param {number} [options.maxAttempts=60] maximum polling attempts before timing out
 * @param {number} [options.initialDelay=1500] initial delay in ms between polls
 * @param {number} [options.delayIncrement=250] increment added to delay after each poll
 * @param {number} [options.maxDelay=3000] cap for delay between polls
 * @param {Array<string>} [options.successStates=["SUCCESS", "Task completed!"]] task states treated as success
 * @param {Array<string>} [options.failureStates=["FAILURE"]] task states treated as failure
 */
export function useTaskPolling({
  maxAttempts = 60,
  initialDelay = 1500,
  delayIncrement = 250,
  maxDelay = 3000,
  successStates = ['SUCCESS', 'Task completed!'],
  failureStates = ['FAILURE']
} = {}) {
  const [status, setStatus] = useState('idle') // idle | processing | success | failure
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const activeRef = useRef(false)
  const cancelRef = useRef(false)

  useEffect(() => {
    return () => {
      cancelRef.current = true
      activeRef.current = false
    }
  }, [])

  const reset = useCallback(() => {
    cancelRef.current = false
    activeRef.current = false
    setStatus('idle')
    setResult(null)
    setError(null)
  }, [])

  const cancel = useCallback(() => {
    cancelRef.current = true
    activeRef.current = false
  }, [])

  const runTask = useCallback(async ({
    startTask,
    pollTask,
    extractResult,
    isSuccess,
    isFailure,
    onStatus
  }) => {
    if (typeof startTask !== 'function' || typeof pollTask !== 'function') {
      throw new Error('useTaskPolling requires startTask and pollTask functions.')
    }

    cancelRef.current = false
    activeRef.current = true
    setStatus('processing')
    setResult(null)
    setError(null)

    try {
      const startPayload = await startTask()
      const taskId = startPayload?.taskId || startPayload?.id || startPayload
      if (!taskId) {
        throw new Error('Task could not be started: missing task identifier.')
      }

      let attempt = 0
      let delayMs = initialDelay

      while (attempt < maxAttempts) {
        if (cancelRef.current) {
          throw new Error('Task polling cancelled.')
        }

        const statusPayload = await pollTask(taskId)
        if (typeof onStatus === 'function') {
          onStatus(statusPayload)
        }

        const currentState = statusPayload?.state || statusPayload?.status
        const success = typeof isSuccess === 'function'
          ? isSuccess(statusPayload)
          : successStates.includes(currentState) && statusPayload?.result
        const failure = typeof isFailure === 'function'
          ? isFailure(statusPayload)
          : failureStates.includes(currentState)

        if (success) {
          const value = typeof extractResult === 'function'
            ? extractResult(statusPayload)
            : statusPayload?.result
          setResult(value)
          setStatus('success')
          return value
        }

        if (failure) {
          const detail = statusPayload?.error || statusPayload?.status || 'Task failed.'
          throw new Error(detail)
        }

        attempt += 1
        await delay(delayMs)
        delayMs = Math.min(delayMs + delayIncrement, maxDelay)
      }

      throw new Error('Task polling timed out. Please try again.')
    } catch (err) {
      setError(err)
      setStatus('failure')
      throw err
    } finally {
      activeRef.current = false
    }
  }, [delayIncrement, initialDelay, maxAttempts, maxDelay, successStates, failureStates])

  return {
    status,
    result,
    error,
    isProcessing: status === 'processing',
    runTask,
    reset,
    cancel
  }
}

export default useTaskPolling
