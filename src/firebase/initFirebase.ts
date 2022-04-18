import { initializeApp } from 'firebase/app'

// the values to initialize the firebase app can be found in your firebase project
const firebaseConfig = {
  apiKey: "AIzaSyBr3E9x0Gf0oJQms7HdH642tn16P6qAva4",
  authDomain: "gitnotes-40a94.firebaseapp.com",
  projectId: "gitnotes-40a94",
  storageBucket: "gitnotes-40a94.appspot.com",
  messagingSenderId: "441539804775",
  appId: "1:441539804775:web:25e9b80c7d74a523969ec2",
  measurementId: "G-LMR4N9LXGD"
}

export const initFirebase = async () => {
  try {
    initializeApp(firebaseConfig)
  } catch (err) {
    console.error(err)
    return err
  }
}