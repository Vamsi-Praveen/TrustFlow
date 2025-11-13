import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '@/api/axios'
import { toast } from 'sonner'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userPermissions, setUserPermissions] = useState(null)
  const [role, setRole] = useState(null)

  const hasPermission = (permission) => {
    return userPermissions.includes(permission)
  }

  const [needsPasswordChange, setNeedsPasswordChange] = useState(false)

  const fetchCurrentUser = useCallback(async () => {
    try {
      const res = await api.get('/users/me')
      if (res.data?.success && res.data?.data) {
        setUser(res?.data?.data?.result)
        setRole(res?.data?.data?.result?.role)
        setUserPermissions(res?.data?.data?.result?.permissions)
        setNeedsPasswordChange(res?.data?.data?.result?.defaultPasswordChanged)
      } else {
        setUser(null)
        setUserPermissions(null)
        setRole(null)
        setNeedsPasswordChange(false)
      }
    } catch {
      setUser(null)
      setUserPermissions(null)
      setRole(null)
      setNeedsPasswordChange(false)
    } finally {
      setIsLoading(false)
    }
  }, [api])

  const login = useCallback(
    async (username, password) => {
      setIsLoading(true)
      try {
        const res = await api.post('/users/authenticate', { username, password })
        if (res.data?.success) {
          await fetchCurrentUser()
        }
        return res
      } finally {
        setIsLoading(false)
      }
    },
    [api, fetchCurrentUser],
  )

  const logout = useCallback(async () => {
    try {
      await api.post('/users/logout')
    } catch (ex) {
      toast.error(ex?.response?.data?.message || 'Unable to Logout User')
    } finally {
      setUser(null)
      setUserPermissions(null)
    }
  }, [api])

  useEffect(() => {
    fetchCurrentUser()
  }, [fetchCurrentUser])

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    fetchCurrentUser,
    needsPasswordChange,
    hasPermission,
    userPermissions,
    role,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
