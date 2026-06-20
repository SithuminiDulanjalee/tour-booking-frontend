import { createContext, useEffect, useState, type ReactNode, type Dispatch, type SetStateAction } from "react"
import { getMyDetails } from "../service/auth"

type AuthUser = {
  id: string
  name: string
  email: string
  roles: string[]
} | null

type AuthContextType = {
  user: AuthUser
  setUser: Dispatch<SetStateAction<AuthUser>>
  loading: boolean
}

export const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (!token) {
      setLoading(false)
      return
    }

    getMyDetails()
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
