import { lazy, Suspense, type ReactNode } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

const Login = lazy(() => import("../pages/Login"))
const Register = lazy(() => import("../pages/Register"))
const Dashboard = lazy(() => import("../pages/Dashboard"))
const Tours = lazy(() => import("../pages/Tours"))
const TourDetail = lazy(() => import("../pages/TourDetail"))
const MyBookings = lazy(() => import("../pages/MyBookings"))
const MyPayments = lazy(() => import("../pages/MyPayments"))
const Payment = lazy(() => import("../pages/Payment"))
const AIChat = lazy(() => import("../pages/AIChat"))
const AdminDashboard = lazy(() => import("../pages/AdminDashboard"))
const AdminTours = lazy(() => import("../pages/AdminTours"))
const AdminBookings = lazy(() => import("../pages/AdminBookings"))
const AdminPayments = lazy(() => import("../pages/AdminPayments"))

type ProtectedRouteProps = {
  children: ReactNode
  roles?: string[]
}

const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="h-14 w-14 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  if (roles && !roles.some((role) => user.roles.includes(role))) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

const Spinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-950">
    <div className="h-14 w-14 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin" />
  </div>
)

const Router = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<Spinner />}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tours" element={<Tours />} />
          <Route path="/tours/:id" element={<TourDetail />} />

          {/* User protected */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-payments"
            element={
              <ProtectedRoute>
                <MyPayments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment/:bookingId"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />
          {/* AI Chat — USER role only */}
          <Route
            path="/ai"
            element={
              <ProtectedRoute roles={["USER"]}>
                <AIChat />
              </ProtectedRoute>
            }
          />

          {/* Admin protected */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["ADMIN"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/tours"
            element={
              <ProtectedRoute roles={["ADMIN"]}>
                <AdminTours />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute roles={["ADMIN"]}>
                <AdminBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/payments"
            element={
              <ProtectedRoute roles={["ADMIN"]}>
                <AdminPayments />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default Router