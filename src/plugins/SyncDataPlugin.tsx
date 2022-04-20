import { FC } from 'react'
import { useInterval } from 'react-use'
import { useSyncData } from '../hooks'
import { initialCategories } from '../utils/data/initialCategories'
import { initialNotes } from '../utils/data/initialNotes'

export const SyncDataPlugin: FC = () => {
  const { syncData, isLoading, isError, isSuccess } = useSyncData()
  const sync = () => {
    syncData({
      noteItems: initialNotes,
      categoryItems: initialCategories
    })
  }

  useInterval(sync, 10000)

  return null
}
