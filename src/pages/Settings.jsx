import { User, Lock, Bell, Save, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { useAuth } from '@/context/AuthContext' // Assuming you have an AuthContext

// Reusable Sub-navigation component
const SettingsSidebarNav = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ]

  return (
    <nav className="flex flex-col space-y-1">
      {navItems.map((item) => (
        <Button
          key={item.id}
          variant={activeTab === item.id ? 'secondary' : 'ghost'}
          className="w-full justify-start"
          onClick={() => setActiveTab(item.id)}
        >
          <item.icon className="mr-2 h-4 w-4" />
          {item.label}
        </Button>
      ))}
    </nav>
  )
}

const Settings = () => {
  const { user } = useAuth() || {
    user: { name: 'Olivia Smith', email: 'olivia.smith@example.com', initial: 'OS' },
  }
  const [activeTab, setActiveTab] = useState('profile')

  // State for forms... (same as before)
  const [profile, setProfile] = useState({
    firstName: 'Olivia',
    lastName: 'Smith',
    email: user.email,
  })
  const [password, setPassword] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [notifications, setNotifications] = useState({
    defaultMethod: 'email',
    onAssignment: true,
    onComment: true,
  })
  const [loading, setLoading] = useState({ profile: false, password: false, notifications: false })

  // Handlers for changes and saving... (same as before)
  const handleProfileChange = (e) =>
    setProfile((prev) => ({ ...prev, [e.target.id]: e.target.value }))
  const handlePasswordChange = (e) =>
    setPassword((prev) => ({ ...prev, [e.target.id]: e.target.value }))
  const handleSaveChanges = async (section) => {
    setLoading((prev) => ({ ...prev, [section]: true }))
    await new Promise((resolve) => setTimeout(resolve, 1500))
    console.log(`Saving ${section}:`, { profile, password, notifications }[section])
    setLoading((prev) => ({ ...prev, [section]: false }))
  }

  return (
    <div className=" min-h-screen flex-1 space-y-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings, profile, and notification preferences.
        </p>
      </div>

      <Separator className="my-6" />

      <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
        <aside className="lg:w-1/4">
          <SettingsSidebarNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </aside>
        <div className="flex-1 lg:max-w-2xl">
          {/* Render content based on activeTab */}
          {activeTab === 'profile' && (
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Public Profile</h2>
              <p className="text-muted-foreground">This is how others will see you on the site.</p>
              <Separator className="my-6" />
              <div className="flex flex-col items-center gap-8 sm:flex-row">
                <div className="flex flex-col items-center gap-2">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={`/avatars/user-avatar.png`} />
                    <AvatarFallback className="text-3xl">{user.initial}</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    Change Picture
                  </Button>
                </div>
                <form
                  className="flex-1 space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSaveChanges('profile')
                  }}
                >
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profile.firstName}
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profile.lastName}
                        onChange={handleProfileChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" disabled={loading.profile}>
                      {loading.profile ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="mr-2 h-4 w-4" />
                      )}{' '}
                      Save Profile
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {activeTab === 'security' && (
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Security</h2>
              <p className="text-muted-foreground">Manage your password and account security.</p>
              <Separator className="my-6" />
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSaveChanges('password')
                }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Password</CardTitle>
                    <CardDescription>
                      Change your password here. After saving, you'll be logged out.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={password.currentPassword}
                        onChange={handlePasswordChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={password.newPassword}
                        onChange={handlePasswordChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={password.confirmPassword}
                        onChange={handlePasswordChange}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="border-t px-6 py-4">
                    <Button type="submit" disabled={loading.password}>
                      {loading.password ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="mr-2 h-4 w-4" />
                      )}{' '}
                      Save Password
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </div>
          )}
          {activeTab === 'notifications' && (
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Notifications</h2>
              <p className="text-muted-foreground">Choose how you want to be notified.</p>
              <Separator className="my-6" />
              <form
                className="space-y-8"
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSaveChanges('notifications')
                }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Method</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label>Default Method</Label>
                      <Select
                        value={notifications.defaultMethod}
                        onValueChange={(value) =>
                          setNotifications((p) => ({ ...p, defaultMethod: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="slack-dm">Slack DM (if available)</SelectItem>
                          <SelectItem value="none">Do Not Notify</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-muted-foreground text-xs">
                        This is your primary method for receiving notifications.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Notify me when...</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="onAssignment" className="flex flex-col space-y-1">
                        <span>I am assigned to an issue</span>
                        <span className="text-muted-foreground leading-snug font-normal">
                          Receive a notification when someone assigns an issue to you.
                        </span>
                      </Label>
                      <Switch
                        id="onAssignment"
                        checked={notifications.onAssignment}
                        onCheckedChange={(checked) =>
                          setNotifications((p) => ({ ...p, onAssignment: checked }))
                        }
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <Label htmlFor="onComment" className="flex flex-col space-y-1">
                        <span>Someone comments on an issue I'm assigned to</span>
                        <span className="text-muted-foreground leading-snug font-normal">
                          Receive a notification for new comments on your issues.
                        </span>
                      </Label>
                      <Switch
                        id="onComment"
                        checked={notifications.onComment}
                        onCheckedChange={(checked) =>
                          setNotifications((p) => ({ ...p, onComment: checked }))
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
                <div className="flex justify-end">
                  <Button type="submit" disabled={loading.notifications}>
                    {loading.notifications ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}{' '}
                    Save Preferences
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Settings
