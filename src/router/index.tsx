import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { lazy, Suspense, type ReactNode } from "react"
import { useAuth } from "../hooks/useAuth"

// import Login from "../pages/Login"
// import Register from "../pages/Register"
// import Home from "../pages/Home"

const Home = lazy(() => import("./../pages/Home"))
const Login = lazy(() => import("./../pages/Login"))
const Register = lazy(() => import("./../pages/Register"))

type RequreAuthTypes = {
  children: ReactNode
  roles?: string[]
}

const RequreAuth = ({ children, roles }: RequreAuthTypes) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to={"/login"} replace />
  }

  if (roles && !roles.some((role) => user?.roles.includes(role))) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold mb-2">Access Denied</h2>
        <p>You do not have permission to view this page.</p>
      </div>
    )
  }

  return <>{children}</>
}

const Router = () => {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          </div>
        }
      >
        <Routes>
          {/* FIX: redirect root / to /home so navigation after login works */}
          <Route path="/" element={<Navigate to="/home" replace />} />

          {/* FIX: added /home route - Login navigates here after successful login */}
          <Route
            path="/home"
            element={
              // <RequreAuth roles={["ADMIN"]}>
              <RequreAuth>
                <Home />
              </RequreAuth>
            }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default Router
