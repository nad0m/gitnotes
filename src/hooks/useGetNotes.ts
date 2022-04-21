import { useQuery } from 'react-query'
import { useAuthStateContext } from '../providers'
import { Queries } from '../utils/api'

export const useGetNotes = () => {
  const { authState } = useAuthStateContext()
  const { isLoading, isError, isSuccess, data, refetch } = useQuery(
    'get-notes',
    () => Queries.getNotes(authState.token),
    {
      enabled: !!authState.token
    }
  )

  return {
    isLoading,
    isError,
    isSuccess,
    noteItems: data,
    refetch
  }
}
