import { useSiteContext } from "../context/ContextProvider"
import HistoricApiData from '../historicData/HistoricApiData.json'
import HistoricTideData from '../historicData/HistoricTideData.json'
import HistoricDayLengthData from '../historicData/HistoricDayLength.json'

const ErrorPage = () => {
  const {errorMsg, setErrorMsg, setApiData, setTideData, setDayLengthData} = useSiteContext()

  const showHistoricData = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()     

    const HistoricApiDataString = JSON.stringify(HistoricApiData) 
    const parsedHistApi = JSON.parse(HistoricApiDataString)
    setApiData(parsedHistApi)
    const HistoricTideDataString = JSON.stringify(HistoricTideData) 
    const parsedHistTide = JSON.parse(HistoricTideDataString)
    setTideData(parsedHistTide)
    const HistoricDayLengthString = JSON.stringify(HistoricDayLengthData) 
    const parsedHistDayLen = JSON.parse(HistoricDayLengthString)
    setDayLengthData(parsedHistDayLen)

    setErrorMsg([])
  }

  let errorCount = 0

  return (
    <div className="w-[90%] max-w-[600px] my-4 mx-auto flex flex-col items-center justify-items-center ">
      {errorMsg.map((item) => <p className="font-bold text-center text-red-600 text-2xl border-4 border-red-600 p-4 mb-4" key={errorCount++}>{item}</p>)}
      <p className="text-center text-xl">hmmm, it's seems there has been an error!</p>
      <p className="text-center text-xl mb-2">Please try clicking the below button to reload the site.</p>
      <button className="w-fit block mx-auto mt-1 p-2 font-bold text-xl text-red-950 border-2 border-yellow-500 rounded-3xl hover:border-red-950 hover:bg-slate-200" onClick={() => {localStorage.clear(); window.location.reload();}}>Reload</button> 
      <br></br>
      <p className="text-center text-xl">It may be that the site has reached the maximum number of users for the day (for example if the error message reads "API quota exceeded").</p>
      <p className="text-center text-xl mb-2">You can try again tomorrow or click the button below to load some old forecast data to browse the site.</p>
      <button className="w-fit block mx-auto mt-1 p-2 font-bold text-xl text-red-950 border-2 border-yellow-500 rounded-3xl hover:border-red-950 hover:bg-slate-200" onClick={(event) => showHistoricData(event)}>Load old forecast data</button>
    </div>
  )
}

export default ErrorPage
