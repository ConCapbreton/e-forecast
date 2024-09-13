import { useSiteContext } from "../context/ContextProvider"

const Corrections = () => {
    const {utcCorrection, msl} = useSiteContext()
  return (
    <div className="w-full" >
      <p className="w-[98%] mx-auto">All times shown are UTC + {utcCorrection} hours</p>
      <p className="w-[98%] mx-auto mb-2">Tide values are corrected assuming an MSL (Mean Sea Level) of {(msl).toFixed(2)} (to two significant figures).</p>
    </div>
  )
}

export default Corrections
