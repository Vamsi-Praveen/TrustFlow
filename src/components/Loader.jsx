import { LoaderIcon } from 'lucide-react'

const Loader = () => {
  return (
    <div className="absolute inset-0 flex h-screen w-screen items-center justify-center">
      <LoaderIcon className="size-7 animate-spin text-black" />
    </div>
  )
}

export default Loader
