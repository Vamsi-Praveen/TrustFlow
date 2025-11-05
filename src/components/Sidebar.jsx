import { Bug } from 'lucide-react'
import React from 'react'
import { Separator } from './ui/separator'
import SidebarNavigation from './SidebarNavigation'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const Sidebar = () => {
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
        <Avatar className="w-10 h-10">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>VP</AvatarFallback>
        </Avatar>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-medium">Vamsi Praveen</span>
          <span className="text-xs text-gray-500">vamsipraveen@trustflow.io</span>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
