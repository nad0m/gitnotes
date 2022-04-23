import { useCallback } from 'react'
import { useMutation } from 'react-query'
import { useAuthStateContext } from '../providers'
import { SyncPayload } from '../types'
import { Mutations } from '../utils/api'

export const useSyncData = () => {
  const { authState, githubUsername } = useAuthStateContext()
  const { isLoading, isError, isSuccess, mutate } = useMutation(
    'sync-data',
    Mutations.syncData
  )

  const syncData = useCallback(
    (syncPayload: SyncPayload) => {
      if (githubUsername) {
        mutate({
          data: syncPayload,
          authState,
          username: githubUsername
        })
      }
    },
    [authState, githubUsername]
  )

  return {
    isLoading,
    isError,
    isSuccess,
    syncData
  }
}
