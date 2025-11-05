import { Cog, Fingerprint, FolderGit2, Home, Users, Users2 } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { Button } from './ui/button'

const SidebarNavigation = () => {
  const sidebarItems = [
    { name: "Home", icon: <Home size={18} />, path: "dashboard" },
    { name: "Users", icon: <Users size={18} />, path: "users" },
    { name: "Projects", icon: <FolderGit2 size={18} />, path: "projects" },
    { name: "Roles", icon: <Fingerprint size={18} />, path: "roles" },
    { name: "Members", icon: <Users2 size={18} />, path: "members" },
    { name: "Configurations", icon: <Cog size={18} />, path: "configuration" },
  ]

  return (
    <div className="flex flex-col gap-1">
      {sidebarItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          end
          className="block"
        >
          {({ isActive }) => (
            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 transition-all duration-150 ease-in-out 
                ${
                  isActive
                    ? 'bg-slate-200 font-bold'
                    : 'font-medium hover:bg-slate-200'
                }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Button>
          )}
        </NavLink>
      ))}
    </div>
  )
}

export default SidebarNavigation
