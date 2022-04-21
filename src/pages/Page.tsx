import { useLocation } from 'react-router-dom'
import { Playground } from '../lib'

export const Page = () => {
  const location = useLocation()

  return <Playground />
}
