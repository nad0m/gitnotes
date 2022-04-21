import { useLocation } from 'react-router-dom'
import { Playground } from '../lib'
import { CurrentEditorProvider } from '../providers/CurrentEditorProvider'

export const Page = () => {
  return (
    <CurrentEditorProvider>
      <Playground />
    </CurrentEditorProvider>
  )
}
