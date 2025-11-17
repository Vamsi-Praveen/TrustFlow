import Loader from '@/components/Loader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import useAxios from '@/hooks/useAxios'
import { AlertCircle, CheckCircle, Loader2, Lock } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

const PasswordReset = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const API = useAxios()
  const [isSuccess, setIsSuccess] = useState(false)

  const [password, setPassword] = useState({
    newPassword: '',
    confirmPassword: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [canSubmit, setCanSubmit] = useState(false)

  const [loading, setLoading] = useState(false)

  const [tokenState, setTokenState] = useState('')

  useEffect(() => {
    const isValid =
      password.newPassword != '' &&
      password.confirmPassword != '' &&
      password.newPassword == password.confirmPassword

    setCanSubmit(isValid)
  }, [password, setPassword])

  useEffect(() => {
    const validateToken = async () => {
      setLoading(true)
      if (!token) return
      try {
        const res = await API.post('/users/verifyresettoken', { token: token })
        if (res?.data?.success) {
          const state = res?.data?.data?.state
          setTokenState(state)
        }
      } catch (error) {
        console.log(error)
        setTokenState(error?.response?.data?.data?.state)
      } finally {
        setLoading(false)
      }
    }
    validateToken()
  }, [token, API])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return
    if (password?.confirmPassword !== password?.newPassword) {
      return toast.error("Passwords didn't match.")
    }
    if (password.newPassword.length < 8) {
      return toast.error('Password length must be equal or greater than 8.')
    }
    setIsLoading(true)
    try {
      await API.post('/users/passwordreset', { token, newPassword: password?.newPassword })
      toast.success('Your password has been reset successfully!')
      setIsSuccess(true)
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || 'Failed to reset password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const renderContent = () => {
    if (tokenState == 'invalid' || tokenState == 'expired') {
      return (
        <CardContent className="flex flex-col items-center justify-center space-y-4">
          <AlertCircle className="text-destructive h-10 w-10" />
          <p className="text-center font-medium">Invalid or Expired Link</p>
          <p className="text-muted-foreground text-center text-sm">
            This password reset link is no longer valid. Please request a new one or contact your
            administrator for help.
          </p>
        </CardContent>
      )
    }

    if (isSuccess) {
      return (
        <CardContent className="flex flex-col items-center justify-center space-y-4 p-10">
          <CheckCircle className="h-10 w-10 text-green-500" />
          <p className="text-center font-medium">Password Reset Successfully!</p>
          <p className="text-muted-foreground text-center text-sm">
            You can now log in with your new password.
          </p>
          <Button asChild className="mt-4">
            <Link to="/auth/login">Back to Login</Link>
          </Button>
        </CardContent>
      )
    }
    return (
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={password.newPassword}
                onChange={(e) => setPassword((prev) => ({ ...prev, newPassword: e.target.value }))}
                placeholder="Enter your new password"
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={password.confirmPassword}
                onChange={(e) =>
                  setPassword((prev) => ({ ...prev, confirmPassword: e.target.value }))
                }
                placeholder="Confirm your new password"
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={!canSubmit || isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Reset Password
          </Button>
        </form>
      </CardContent>
    )
  }

  if (loading) {
    return <Loader />
  }

  return (
    <div className="bg-muted/30 flex h-screen w-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4 flex flex-col items-center gap-2">
            <div className="bg-primary text-primary-foreground rounded-full p-3">
              <Lock className="h-6 w-6" />
            </div>
            <p className="text-2xl font-bold">TrustFlow</p>
          </div>
          <CardTitle className="text-2xl font-bold">Reset Your Password</CardTitle>
        </CardHeader>
        {renderContent()}
      </Card>
    </div>
  )
}

export default PasswordReset
