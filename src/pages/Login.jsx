import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const Login = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl flex rounded-lg overflow-hidden bg-background">
        <div className="hidden md:block md:w-1/2">
          <img
            src='/assets/images/login_banner.png'
            alt='Login Banner'
            className='h-full w-full object-cover'
          />
        </div>
        <div className="w-full md:w-1/2 p-8 flex items-center justify-center">
          <Card className="w-full max-w-md border-0 shadow-none">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold">Welcome Back!</CardTitle>
              <CardDescription>
                Enter your credentials to access your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      autoComplete="off"
                      spellCheck="off"
                    />
                  </div>

                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <a
                        href="#"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </div>
                    <Input id="password" type="password" required />
                  </div>

                  <Button type="submit" className="w-full cursor-pointer">
                    Login
                  </Button>
                </div>
              </form>
              <div className="mt-6 text-center text-sm">
                Don&apos;t have an account?{' '}
                <a href="#" className="underline font-semibold">
                  Sign Up
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Login