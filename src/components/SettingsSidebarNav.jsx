import { Bell, Lock, User } from 'lucide-react'
import { Button } from './ui/button'

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

export default SettingsSidebarNav
