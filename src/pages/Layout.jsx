import Sidebar from '@/components/Sidebar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className='flex h-screen w-screen'>
      <aside className='bg-gray-100 w-[300px] p-4'>
        <Sidebar />
      </aside>
      <main className='flex-1 p-6 overflow-auto'>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout