import { Button } from '@/components/ui/button'
import { ShieldAlert } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className='h-screen w-screen flex items-center justify-center flex-col gap-2'>
        <ShieldAlert className='size-10'/>
        <p className='text-2xl font-bold'>404 Not Found</p>
        <span className='text-gray-500'>The requested resource / page is not found</span>
        <Button asChild className="w-[250px] mt-4" variant="outline">
            <Link to="/">
            Back
            </Link>
        </Button>
    </div>
  )
}

export default NotFound