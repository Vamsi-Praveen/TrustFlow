import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/context/AuthContext'
import useAxios from '@/hooks/useAxios'
import { Loader2, Lock } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const ConfigurePassword = () => {
  const { fetchCurrentUser } = useAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState({
    newPassword: '',
    confirmPassword: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [canSubmit, setCanSubmit] = useState(false)

  useEffect(() => {
    const isValid =
      password.newPassword != '' &&
      password.confirmPassword != '' &&
      password.newPassword == password.confirmPassword

    setCanSubmit(isValid)
  }, [password, setPassword])

  const API = useAxios()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      if (password?.confirmPassword !== password?.newPassword) {
        return toast.error("Passwords didn't match.")
      }
      if (password.newPassword.length < 8) {
        return toast.error('Password length must be equal or greater than 8.')
      }
      await API.post('/users/initialsetpassword', password)
      toast.success('Password Changed Successfully')
      await fetchCurrentUser()
      navigate('/dashboard')
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-muted/30 flex h-screen w-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-3 flex flex-col items-center gap-2">
            <div className="bg-primary text-primary-foreground rounded-full p-3">
              <Lock className="h-6 w-6" />
            </div>
            <p className="text-2xl font-bold">TrustFlow</p>
          </div>
          <CardTitle className="text-2xl font-bold">Set Your New Password</CardTitle>
          <CardDescription>
            For your security, you must change your password before you can continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="mt-2 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={password.newPassword}
                  onChange={(e) =>
                    setPassword((prev) => ({ ...prev, newPassword: e.target.value }))
                  }
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
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Set Password & Continue
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default ConfigurePassword
