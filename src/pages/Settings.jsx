import SettingsSidebarNav from '@/components/SettingsSidebarNav'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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
import { useAuth } from '@/context/AuthContext'
import useAxios from '@/hooks/useAxios'
import { Loader, Loader2, Save } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

const Settings = () => {
  const { user, fetchCurrentUser } = useAuth()

  const [activeTab, setActiveTab] = useState('profile')

  const originalProfile = useMemo(
    () => ({
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      username: user?.username,
      phoneNumber: user?.phoneNumber,
    }),
    [user],
  )

  const [profile, setProfile] = useState({ ...originalProfile })

  const isProfileDirty =
    profile.firstName !== originalProfile.firstName ||
    profile.lastName !== originalProfile.lastName ||
    profile.email !== originalProfile.email ||
    profile.username !== originalProfile.username ||
    profile.phoneNumber !== originalProfile.phoneNumber

  const [password, setPassword] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const isPasswordValid =
    password.currentPassword != '' && password.newPassword != '' && password.confirmPassword != ''

  const [originalNotifications, setOriginalNotifications] = useState(null)

  const [notifications, setNotifications] = useState({
    defaultNotificationMethod: 'email',
    notifyOnAssignedBug: true,
    notifyOnNewComment: true,
    notifyOnStatusChange: true,
  })

  const isNotificationsDirty = useMemo(() => {
    if (!originalNotifications) return false
    return (
      notifications.defaultNotificationMethod !== originalNotifications.defaultNotificationMethod ||
      notifications.notifyOnAssignedBug !== originalNotifications.notifyOnAssignedBug ||
      notifications.notifyOnStatusChange !== originalNotifications.notifyOnStatusChange ||
      notifications.notifyOnNewComment !== originalNotifications.notifyOnNewComment
    )
  }, [notifications, originalNotifications])

  const [loading, setLoading] = useState({
    profile: false,
    password: false,
    notifications: false,
    notificationFetching: false,
  })

  const API = useAxios()

  useEffect(() => {
    if (user) {
      setProfile({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        phoneNumber: user.phoneNumber,
      })
    }
  }, [user])

  const fetchUserNotificationSetting = async () => {
    try {
      setLoading((prev) => ({ ...prev, notificationFetching: true }))
      const res = await API.get('/users/notificationsettings')
      if (res?.data?.success && res?.data?.data) {
        const notification = res?.data?.data
        if (notification) {
          setNotifications((prev) => ({
            ...prev,
            defaultNotificationMethod: notification?.defaultNotificationMethod.toLowerCase(),
            notifyOnAssignedBug: notification?.notifyOnAssignedBug,
            notifyOnStatusChange: notification?.notifyOnStatusChange,
            notifyOnNewComment: notification?.notifyOnNewComment,
          }))
          setOriginalNotifications({
            defaultNotificationMethod: notification.defaultNotificationMethod.toLowerCase(),
            notifyOnAssignedBug: notification.notifyOnAssignedBug,
            notifyOnStatusChange: notification.notifyOnStatusChange,
            notifyOnNewComment: notification.notifyOnNewComment,
          })
        }
      }
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message)
    } finally {
      setLoading((prev) => ({ ...prev, notificationFetching: false }))
    }
  }

  useEffect(() => {
    if (activeTab === 'notifications') {
      fetchUserNotificationSetting()
    }
  }, [activeTab])

  const handleProfileChange = (e) =>
    setProfile((prev) => ({ ...prev, [e.target.id]: e.target.value }))

  const handlePasswordChange = (e) =>
    setPassword((prev) => ({ ...prev, [e.target.id]: e.target.value }))

  const handleSaveChanges = async (section) => {
    setLoading((prev) => ({ ...prev, [section]: true }))
    try {
      if (section.toLowerCase() == 'profile') {
        await API.patch(`/users/profile/${user?.id}`, profile)
        fetchCurrentUser()
        toast.success('Profile Updated Succesfull')
      }

      if (section.toLowerCase() == 'password') {
        if (password.newPassword != password.confirmPassword) {
          toast.error("Password's didn't match")
          return
        }
        await API.post('/users/changepassword', password)
        setPassword({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        })
        toast.success('Password updated successfully')
      }
      if (section.toLowerCase() == 'notifications') {
        await API.put('/users/notificationsettings', notifications)
        fetchUserNotificationSetting()
        toast.success('Notification Prefrence Updated Successfully')
      }
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message)
    } finally {
      setLoading((prev) => ({ ...prev, [section]: false }))
    }
  }

  return (
    <div className="min-h-screen flex-1 space-y-4">
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
          {activeTab === 'profile' && (
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Public Profile</h2>
              <p className="text-muted-foreground">This is how others will see you on the site.</p>
              <Separator className="my-6" />
              <div className="flex flex-col items-center gap-8 sm:flex-row">
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage
                      src={`https://avatar.iran.liara.run/username?username=${user?.firstName}+${user?.lastName}`}
                    />
                    <AvatarFallback className="text-3xl">
                      {user?.firstName.split('')[0]}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    variant="outline"
                    size="sm"
                    className="disabled:cursor-not-allowed"
                    disabled
                  >
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
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        type="text"
                        value={profile.username}
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Mobile</Label>
                      <Input
                        id="phoneNumber"
                        type="text"
                        placeHolder="Mobile Number"
                        value={profile?.phoneNumber}
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
                      disabled
                      onChange={handleProfileChange}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={loading.profile || !isProfileDirty}>
                      {loading.profile ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="mr-2 h-4 w-4" />
                      )}
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
                    <Button type="submit" disabled={loading.password || !isPasswordValid}>
                      {loading.password ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="mr-2 h-4 w-4" />
                      )}{' '}
                      Change Password
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </div>
          )}
          {activeTab === 'notifications' &&
            (loading.notificationFetching ? (
              <div className="flex h-[300px] w-full items-center justify-center">
                <Loader className="animate-spin" />
              </div>
            ) : (
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
                      <div className="mb-3 flex gap-2">
                        <Label>Default Method</Label>
                        <Select
                          value={notifications.defaultNotificationMethod}
                          onValueChange={(value) =>
                            setNotifications((p) => ({ ...p, defaultNotificationMethod: value }))
                          }
                        >
                          <SelectTrigger className="min-w-48">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="slack-dm">Slack DM (if available)</SelectItem>
                            <SelectItem value="teams-dm">Teams DM (if available)</SelectItem>
                            <SelectItem value="none">Do Not Notify</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <p className="text-muted-foreground text-xs">
                        This is your primary method for receiving notifications.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Notify me when</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="onAssignment" className="flex flex-col space-y-1">
                          <span className="w-full">I am assigned to an issue</span>
                          <span className="text-muted-foreground leading-snug font-normal">
                            Receive a notification when someone assigns an issue to you.
                          </span>
                        </Label>
                        <Switch
                          id="onAssignment"
                          checked={notifications.notifyOnAssignedBug}
                          onCheckedChange={(checked) =>
                            setNotifications((p) => ({ ...p, notifyOnAssignedBug: checked }))
                          }
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <Label htmlFor="onComment" className="flex flex-col space-y-1">
                          <span className="w-full">
                            Someone comments on an issue I'm assigned to
                          </span>
                          <span className="text-muted-foreground leading-snug font-normal">
                            Receive a notification for new comments on your issues.
                          </span>
                        </Label>
                        <Switch
                          id="onComment"
                          checked={notifications.notifyOnNewComment}
                          onCheckedChange={(checked) =>
                            setNotifications((p) => ({ ...p, notifyOnNewComment: checked }))
                          }
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <Label htmlFor="onStatusChange" className="flex flex-col space-y-1">
                          <span className="w-full">
                            When the status of an assigned issue changes
                          </span>
                          <span className="text-muted-foreground leading-snug font-normal">
                            Receive a notification when the status of an issue assigned to you
                            changes.
                          </span>
                        </Label>
                        <Switch
                          id="onStatusChange"
                          checked={notifications.notifyOnStatusChange}
                          onCheckedChange={(checked) =>
                            setNotifications((p) => ({ ...p, notifyOnStatusChange: checked }))
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>
                  <div className="flex justify-end">
                    <Button type="submit" disabled={loading.notifications || !isNotificationsDirty}>
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
            ))}
        </div>
      </div>
    </div>
  )
}

export default Settings
