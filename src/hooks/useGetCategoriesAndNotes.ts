import { useQuery } from 'react-query'
import { useAuthStateContext } from '../providers'
import { Queries } from '../utils/api'

export const useGetCategoriesAndNotes = () => {
  const { authState, githubUsername } = useAuthStateContext()
  const { isLoading, isError, isSuccess, data, refetch } = useQuery(
    'get-categories-and-notes',
    () =>
      Queries.getCategoriesAndNotes({
        accessToken: authState.token,
        username: githubUsername ?? ''
      }),
    {
      enabled: !!authState.token && !!githubUsername
    }
  )

  return {
    isLoading,
    isError,
    isSuccess,
    categoriesAndNotes: data,
    refetch
  }
}
