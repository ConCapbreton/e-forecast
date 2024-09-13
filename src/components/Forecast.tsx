import { useSiteContext } from "../context/ContextProvider"
import { FaArrowDownLong } from "react-icons/fa6";
import Corrections from "./Corrections";

const Forecast = () => {
  const {FORECAST, apiData, tideData, utcCorrection, msl} = useSiteContext()
  //TABLE FORMATTING

  const thTailwind: string = "sticky -left-1 w-40 px-2 bg-slate-400 z-10 outline outline-white" 
  const dateTimeTailwind: string = "bg-slate-300 ml-1 px-2 outline outline-white"
  const tdTailwind: string = "text-center bg-slate-100 outline outline-white"

  // SETTING FORECAST TABLE DATA
  let dateArray: JSX.Element[] = []
  let hours: JSX.Element[] = []
  let swellHeight: JSX.Element[] = []
  let waveHeight: JSX.Element[] = []
  let swellPeriod: JSX.Element[] = []
  let swellDirection: JSX.Element[] = []
  let windSpeed: JSX.Element[] = []
  let windDirection: JSX.Element[] = []
  let gusts: JSX.Element[] = []
  let seaLevel: JSX.Element[] = []
  let waterTemp: JSX.Element[] = []
  let airTemp: JSX.Element[] = []
  
  // i = 120 is for 5 days of forecast data 
  for (let i = 0; i < 121; i = i + 2) { 
    
    // RE-FORMAT DATE
    let dateString = new Date (apiData.hours[i].time).toDateString()
    let date = dateString.slice(0, 10)
    
    //RE-FORMAT TIME
    let timeData = apiData.hours[i].time.slice(11, 13)
    let timeNumber = Number(timeData)
    let correctedHour: number
    if (timeNumber === 22 && utcCorrection === 2) {correctedHour = 0}
    else {correctedHour = timeNumber + utcCorrection}

    // SET TABLE DATA
    dateArray.push(<th className={dateTimeTailwind} key={i} scope="col">{date}</th>)
    hours.push(<th className={dateTimeTailwind} key={i} scope="col">{correctedHour}{correctedHour < 12 ? "am" : "pm"}</th>)
    swellHeight.push(<td className={tdTailwind} key={i} scope="col">{(apiData.hours[i].swellHeight.sg).toFixed(2)}</td>)
    waveHeight.push(<td className={tdTailwind} key={i} scope="col">{(apiData.hours[i].waveHeight.sg).toFixed(2)}</td>)
    swellPeriod.push(<td className={tdTailwind} key={i} scope="col">{(apiData.hours[i].swellPeriod.sg).toFixed(0)}</td>)
    swellDirection.push(<td className={tdTailwind} key={i} scope="col"><FaArrowDownLong className="text-2xl w-fit mx-auto z-0" style={{transform: `rotate(${apiData.hours[i].swellDirection.sg}deg)`}}/></td>)
    windSpeed.push(<td className={tdTailwind} key={i} scope="col">{(apiData.hours[i].windSpeed.sg * 3.6).toFixed(0)}</td>)
    windDirection.push(<td className={tdTailwind} key={i} scope="col"><FaArrowDownLong className="text-2xl w-fit mx-auto relative z-0" style={{transform: `rotate(${apiData.hours[i].windDirection.sg}deg)`}}/></td>)
    gusts.push(<td className={tdTailwind} key={i} scope="col">{(apiData.hours[i].gust.sg * 3.6).toFixed(0)}</td>)
    seaLevel.push(<td className={tdTailwind} key={i} scope="col">{(tideData.data[i].sg + msl).toFixed(1)}</td>) // MSL CORRECTION
    waterTemp.push(<td className={tdTailwind} key={i} scope="col">{(apiData.hours[i].waterTemperature.sg).toFixed(0)}</td>)
    airTemp.push(<td className={tdTailwind} key={i} scope="col">{(apiData.hours[i].airTemperature.sg).toFixed(0)}</td>)
  } 

  return (
    <>
      <div className="min-h-screen">
        <p className="text-center mt-4 font-bold text-3xl">{FORECAST}</p>
        <p className="text-center mb-4 ms:text-lg">Latitude: 43.656221 Longitude: -1.452766</p>
        <div className="w-[98%] mx-auto mb-4 overflow-x-scroll">
      
          <table className="table-fixed">
            <caption className="hidden">Forecast Data</caption>
            <thead>
              <tr>
                <th scope="row" className={thTailwind}>Date</th>
                {dateArray}
              </tr> 
              <tr>
                <th scope="row" className={thTailwind}>Time</th>
                {hours}
              </tr> 
            </thead> 
            <tbody>
              <tr>
                <th scope="row" className={thTailwind}>Swell Height (m)</th>
                {swellHeight}
              </tr>
              <tr>
                <th scope="row" className={thTailwind}>Wave Height (m)</th>
                {waveHeight}
              </tr>
              <tr>
                <th scope="row" className={thTailwind}>Swell Period (s)</th>
                {swellPeriod}
              </tr>
              <tr>
                <th scope="row" className={thTailwind}>Swell Direction</th>
                {swellDirection}
              </tr>
              <tr>
                <th scope="row" className={thTailwind}>Wind Speed (km/h)</th>
                {windSpeed}
              </tr>
              <tr>
                <th scope="row"className={thTailwind}>Wind Direction</th>
                {windDirection}
              </tr>
              <tr>
                <th scope="row" className={thTailwind}>Gusts (km/h)</th>
                {gusts}
              </tr>
              <tr>
                <th scope="row"className={thTailwind}>Tide* (m)</th>
                {seaLevel}
              </tr>
              <tr>
                <th scope="row" className={thTailwind}>Water Temp (°C)</th>
                {waterTemp}
              </tr>
              <tr>
                <th scope="row" className={thTailwind}>Air Temp (°C)</th>
                {airTemp}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <Corrections />
    </>
  )
}

export default Forecast
