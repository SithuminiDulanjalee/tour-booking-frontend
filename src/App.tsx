import { AuthProvider } from "./context/AuthContext"
import Router from "./router"

const App = () => {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  )
}

export default App