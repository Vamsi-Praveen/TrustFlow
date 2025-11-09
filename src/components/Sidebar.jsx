import { useAuth } from '@/context/AuthContext'
import { Bug, Loader, LogOut } from 'lucide-react'
import SidebarNavigation from './SidebarNavigation'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Separator } from './ui/separator'

const Sidebar = () => {
  const { user, logout } = useAuth()
  return (
    <aside className="flex h-full w-full flex-col justify-between p-1">
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Bug />
          <h1 className="text-xl font-bold tracking-tight">TrustFlow.</h1>
        </div>

        <Separator className="mb-4" />

        <SidebarNavigation />
      </div>
      <div className="flex items-center gap-3 border-t pt-4">
        <Avatar className="h-10 w-10 border object-contain">
          <AvatarImage
            src={`https://avatar.iran.liara.run/username?username=${user.firstName}+${user.lastName}`}
            alt="Profile"
          />
          <AvatarFallback>
            <Loader className="size-4 animate-spin" />
          </AvatarFallback>
        </Avatar>
        <div className="flex w-[200px] max-w-[200px] flex-col overflow-hidden leading-tight">
          <span className="truncate text-sm font-medium capitalize">{user.username}</span>
          <span className="truncate text-xs text-gray-500">{user.email}</span>
        </div>
        <button
          onClick={logout}
          className="cursor-pointer rounded-sm border p-2 transition hover:bg-red-50"
          aria-label="Logout"
        >
          <LogOut className="size-5 text-red-500" />
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
