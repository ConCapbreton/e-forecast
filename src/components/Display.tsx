import { useSiteContext } from "../context/ContextProvider"
import IsLoading from "./IsLoading"
import ErrorPage from "./ErrorPage"
import Forecast from "./Forecast"
import WhenToSurf from "./WhenToSurf"
import WhereToSurf from "./WhereToSurf"
import MainPage from "./MainPage"

const Display = () => {
  
  const {siteDisplay, FORECAST, WHEN, WHERE, isLoading, errorMsg} = useSiteContext()

  let content: JSX.Element
  if (isLoading) {content = <IsLoading />}
  else if (errorMsg.length > 0) {content = <ErrorPage />}
  else if (siteDisplay === FORECAST) {content = <Forecast />}
  else if (siteDisplay === WHEN) {content = <WhenToSurf />}
  else if (siteDisplay === WHERE) {content = <WhereToSurf />}
  else {content = <MainPage />}
  
  return (
    <div>
      {content}
    </div>
  )
}

export default Display
