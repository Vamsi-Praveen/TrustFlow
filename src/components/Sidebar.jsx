import { useAuth } from '@/context/AuthContext'
import { Bug, Loader, LogOut } from 'lucide-react'
import SidebarNavigation from './SidebarNavigation'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Separator } from './ui/separator'

const Sidebar = () => {

  const { user, logout } = useAuth();
  return (
    <aside className="h-full w-full flex flex-col justify-between p-1">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Bug />
          <h1 className="font-bold text-xl tracking-tight">TrustFlow.</h1>
        </div>

        <Separator className="mb-4" />

        <SidebarNavigation />
      </div>
      <div className="flex items-center gap-3 border-t pt-4">
        <Avatar className="w-10 h-10 object-contain border">
          <AvatarImage src={`https://avatar.iran.liara.run/username?username=${user.firstName}+${user.lastName}`} alt="Profile" />
          <AvatarFallback><Loader className='size-4 animate-spin' /></AvatarFallback>
        </Avatar>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-medium capitalize">{user.username}</span>
          <span className="text-xs text-gray-500">{user.email}</span>
        </div>
        <button
          onClick={logout}
          className="border rounded-sm p-2 hover:bg-red-50 transition cursor-pointer"
          aria-label="Logout"
        >
          <LogOut className="size-5 text-red-500" />
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
