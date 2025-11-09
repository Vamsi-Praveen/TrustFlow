import { useAuth } from '@/context/AuthContext'
import { Bug, Fingerprint, FolderGit2, Home, MonitorCog, Settings, UserCog2 } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { Button } from './ui/button'

const SidebarNavigation = () => {
  const { hasPermission } = useAuth()

  const sidebarItems = [
    {
      name: 'Home',
      icon: <Home size={18} />,
      path: 'dashboard',
      permission: null,
    },
    {
      name: 'User Management',
      icon: <UserCog2 size={18} />,
      path: 'users',
      permission: 'CanManageAdminSettings',
    },
    {
      name: 'Projects',
      icon: <FolderGit2 size={18} />,
      path: 'projects',
      permission: ['CanCreateProject', 'CanEditProject', 'CanDeleteProject', 'CanViewProject'],
    },
    {
      name: 'Issues',
      icon: <Bug size={18} />,
      path: 'issues',
      permission: ['CanCreateBug', 'CanEditBug', 'CanChangeBugStatus', 'CanCommentOnBugs'],
    },
    {
      name: 'Roles',
      icon: <Fingerprint size={18} />,
      path: 'roles',
      permission: 'CanManageAdminSettings',
    },
    {
      name: 'Configurations',
      icon: <MonitorCog size={18} />,
      path: 'configuration',
      permission: 'CanManageAdminSettings',
    },
    {
      name: 'Settings',
      icon: <Settings size={18} />,
      path: 'settings',
      permission: null,
    },
  ]

  const canShowItem = (permission) => {
    if (!permission) return true

    if (Array.isArray(permission)) {
      return permission.some((p) => hasPermission(p))
    }
    return hasPermission(permission)
  }

  return (
    <div className="flex flex-col gap-1">
      {sidebarItems
        .filter((item) => canShowItem(item.permission))
        .map((item) => (
          <NavLink key={item.name} to={item.path} end className="block">
            {({ isActive }) => (
              <Button
                variant="ghost"
                className={`w-full justify-start gap-2 transition-all duration-150 ease-in-out ${
                  isActive ? 'bg-slate-200 font-bold' : 'font-medium hover:bg-slate-200'
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
