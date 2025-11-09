import { Button } from '@/components/ui/button'
import { ShieldAlert } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-2">
      <ShieldAlert className="size-10" />
      <p className="text-2xl font-bold">404 Not Found</p>
      <span className="text-gray-500">The requested resource / page is not found</span>
      <Button asChild className="mt-4 w-[250px]" variant="outline">
        <Link to="/">Back</Link>
      </Button>
    </div>
  )
}

export default NotFound
