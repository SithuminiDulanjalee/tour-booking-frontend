// rafce

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { getMyDetails, login } from "../service/auth"
import { useAuth } from "../hooks/useAuth"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPasssword] = useState("")
  const { setUser } = useAuth()

  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill all fields..!")
      return
    }
    try {
      const data = await login(email, password)
      if (data?.data?.accessToken) {
        await localStorage.setItem("accessToken", data.data.accessToken)
        await localStorage.setItem("refreshToken", data.data.refreshToken)

        const resData = await getMyDetails()
        const userData = resData?.data
        setUser(userData)

        navigate("/home")
      } else {
        alert("Login fail..!")
      }
    } catch {
      alert("Login fail..!")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="flex flex-col gap-4 w-80">
        <input
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <input
          placeholder="password"
          value={password}
          onChange={(e) => setPasssword(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <button
          onClick={handleLogin}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          Login
        </button>
        <p className="mt-4 text-gray-700 text-center">
          <span>Don't have an account? </span>
          <button
            onClick={() => {
              navigate("/register")
            }}
            className="text-blue-600 font-semibold hover:underline"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  )
}

export default Login
