import { useQuery } from 'react-query'
import { useAuthStateContext } from '../providers'
import { Queries } from '../utils/api'

export const useGetCategories = () => {
  const { authState } = useAuthStateContext()
  const { isLoading, isError, isSuccess, data, refetch } = useQuery(
    'get-categories',
    () => Queries.getCategories(authState.token),
    {
      enabled: !!authState.token
    }
  )

  return {
    isLoading,
    isError,
    isSuccess,
    categoryItems: data,
    refetch
  }
}
