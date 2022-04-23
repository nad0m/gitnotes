import { useQuery } from 'react-query'
import { getGitHubUsername } from '../utils/api'

export const useGetGitHubUsername = (token: string) => {
  const { isLoading, isError, isSuccess, data, refetch } = useQuery(
    'get-github-username',
    () => getGitHubUsername(token),
    {
      enabled: !!token
    }
  )

  return {
    isLoading,
    isError,
    isSuccess,
    githubUsername: data,
    refetch
  }
}
