import { LoaderIcon } from 'lucide-react'

const Loader = () => {
  return (
    <div className="absolute inset-0 flex h-screen w-screen items-center justify-center bg-black/60">
      <LoaderIcon className="size-7 animate-spin text-white" />
    </div>
  )
}

export default Loader
