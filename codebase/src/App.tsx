import './App.css'
import { AppShell } from './components/AppShell'
import { FalconProvider } from './hooks/useFalconStore'

function App() {
  return (
    <FalconProvider>
      <AppShell />
    </FalconProvider>
  )
}

export default App
