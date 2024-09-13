import { FaGear } from "react-icons/fa6";

const IsLoading = () => {
  return (
    <div className="w-60 mx-auto flex flex-col items-center justify-center">
        <FaGear className="animate-spin text-9xl text-BGC mt-24 mb-8" />
        <p className="ml-5 text-2xl">LOADING...</p>
    </div>
  )
}

export default IsLoading
