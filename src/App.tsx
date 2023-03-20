import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useContext, useEffect } from 'react'
import { LocalStorageEventTarget } from '@/utils'
import { AppContext } from '@/contexts'
import AppRoutes from './routes/AppRoutes'

function App() {
  const { reset } = useContext(AppContext)

  useEffect(() => {
    LocalStorageEventTarget.addEventListener('clearLS', reset)
    return () => {
      LocalStorageEventTarget.removeEventListener('clearLS', reset)
    }
  }, [reset])

  return (
    <div>
      <AppRoutes />
      <ToastContainer />
    </div>
  )
}

export default App
