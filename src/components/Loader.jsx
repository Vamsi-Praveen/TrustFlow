import { LoaderIcon } from 'lucide-react'

const Loader = () => {
  return (
    <div className='h-screen w-screen absolute inset-0 flex items-center justify-center bg-black/60'>
        <LoaderIcon className='animate-spin size-7 text-white '/>
    </div>
  )
}

export default Loader