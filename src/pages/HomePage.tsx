import { FC } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth, signOut } from 'firebase/auth';
import { Editor } from '../components/Editor';
import App from '../lexical-playground/src/lib/App'
export const HomePage: FC = () => {
  const auth = getAuth()
  const [user, loading, error] = useAuthState(auth)

  console.log({ user, loading, error })

  return (
    <App />
  )
}
