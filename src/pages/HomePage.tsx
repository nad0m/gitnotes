import { FC } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth, signOut } from 'firebase/auth';

export const HomePage: FC = () => {
  const auth = getAuth()
  const [user, loading, error] = useAuthState(auth)

  console.log({ user, loading, error })

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <button onClick={() => signOut(auth)}>Sign out</button>
      </header>
    </div>
  )
}
