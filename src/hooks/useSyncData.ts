import { useMutation } from 'react-query'
import { useAuthStateContext } from '../providers'
import { SyncPayload } from '../types'
import { Mutations } from '../utils/api'

export const useSyncData = () => {
  const { authState } = useAuthStateContext()
  const { isLoading, isError, isSuccess, mutate } = useMutation(
    'sync-data',
    Mutations.syncData
  )

  const syncData = async (syncPayload: SyncPayload) => {
    mutate({
      data: syncPayload,
      authState
    })
  }

  return {
    isLoading,
    isError,
    isSuccess,
    syncData
  }
}
