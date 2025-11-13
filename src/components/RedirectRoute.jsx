import { useAuth } from '@/context/AuthContext'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const RedirectRoute = ({ children }) => {
  const { isAuthenticated, needsPasswordChange, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  useEffect(() => {
    if (isLoading) {
      return
    }
    const isAuthPage = location.pathname === '/auth/login'
    const isPasswordChangePage = location.pathname === '/auth/configurepassword'

    if (isAuthenticated) {
      if (!needsPasswordChange && !isPasswordChangePage) {
        navigate('/auth/configurepassword', { replace: true })
      } else if (needsPasswordChange && (isAuthPage || isPasswordChangePage)) {
        navigate('/dashboard', { replace: true })
      }
    } else if (!isAuthPage) {
      navigate('/auth/login', { state: { from: location }, replace: true })
    }
  }, [isAuthenticated, needsPasswordChange, isLoading, navigate, location])

  return children
}

export default RedirectRoute
