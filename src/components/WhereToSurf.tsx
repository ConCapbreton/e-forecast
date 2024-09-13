import { useSiteContext } from "../context/ContextProvider"
import { useState } from "react"
import { FaArrowDownLong } from "react-icons/fa6";
import Corrections from "./Corrections";

const WhereToSurf = () => {
  const {WHERE, siteDisplay, apiData, dayLengthData, tideData, spots, utcCorrection, msl, goodWindStart, goodWindEnd, badWindStart, badWindEnd, lightWind, strongWind, smallWave, bigWave, shortPeriod, longPeriod} = useSiteContext()
  const [surfHours, setSurfHours] = useState<JSX.Element[]>()
  const [selectedForecast, setSelectedForecast] = useState<JSX.Element[]>()

  // TIME ARRANGER FUNCTION
  const timeArranger = (timeString: string): string => {
    let number = Number (timeString.slice(0, 2))
    let numberUtc = number + utcCorrection
    let amPm = numberUtc < 12 ? "am" : "pm"
    let correctedTime = `${numberUtc}:${timeString.slice(2, 4)} ${amPm}`
    return correctedTime
  }

  //DATES FOR DISPLAY
  const firstApiDate = new Date (apiData.hours[12].time).toDateString()
  const secondApiDate = new Date (apiData.hours[36].time).toDateString()
  const thirdApiDate = new Date (apiData.hours[60].time).toDateString()
  const fourthApiDate = new Date (apiData.hours[84].time).toDateString()
  const fifthApiDate = new Date (apiData.hours[108].time).toDateString()
  
  //SET DAYLIGHT HOURS LIST AFTER DAY SELECTION
  const setTimes = () => {
    //GET DAYLIGHT HOURS
    const daySelector = document.getElementById("day-selector") as HTMLSelectElement | null
    const selectedValue = Number(daySelector?.selectedOptions[0].value)
    if (selectedValue === 5) {setSurfHours([<option key="" value="">First select a day</option>]); return}
    const firstLight = dayLengthData.results[selectedValue].dawn
    const lastLight = dayLengthData.results[selectedValue].dusk
    const firstHour = Number(firstLight.slice(1, 2))
    const hoursBefore = selectedValue === 0 ? (firstHour - 1) : ((selectedValue * 24) + (firstHour - 1))
    const lastHour = Number(lastLight.slice(0,2))
    const hoursAfter = selectedValue === 0 ? (lastHour + 1) : (selectedValue * 24) + (lastHour + 1)

    //CREATE THE OPTIONS FOR THE TIME SELECTOR
    let filteredHours: any[] = []
    apiData.hours.forEach((hour: any) => {if (apiData.hours.indexOf(hour) > hoursBefore && apiData.hours.indexOf(hour) < hoursAfter) {filteredHours.push(hour)}})
    let options: JSX.Element[] = []
    let countTime = 0
    filteredHours.forEach((item) => options.push(<option key={countTime++} value={item.time} >{Number(item.time.slice(11, 13)) + utcCorrection} {(Number(item.time.slice(11, 13)) + utcCorrection) < 12 ? "am" : "pm" }</option>)) 
    setSurfHours(options)
  }

  //FILTER THE SPOTS TO DISPLAY AND SHOW THE FORECAST AT THAT TIME
  const showWhere = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
        
    // GET VALUES IN DAY AND TIME SELECTs
    const daySelector = document.getElementById("day-selector") as HTMLSelectElement | null
    const selectedValue = Number(daySelector?.selectedOptions[0].value)
    const selectedTime = document.getElementById("time-selector") as HTMLSelectElement
    if (!selectedTime.value) return 

    // SET DATE AND TIME TO DISPLAY
    const dateDisplay = new Date(selectedTime.value).toDateString()
    const time = Number (selectedTime.value.slice(11, 13)) + utcCorrection
    
    // GET THAT FORECAST FROM THE ARRAY
    let selectedForecastIndex = apiData.hours.findIndex((hour: any) => hour.time === selectedTime.value)
    
    //FILTER SPOTS BY TIDE AND CREATE TIDE DISPLAY
    let selectedSpots = [] as typeof spots 
    selectedSpots = spots.filter((tide) => (tideData.data[selectedForecastIndex].sg + msl).toFixed(2) > tide.lowestTide.toFixed(2) && (tideData.data[selectedForecastIndex].sg + msl).toFixed(2) < tide.highestTide.toFixed(2))
    const lowestSpotTide = spots.reduce((previous, current) => previous.lowestTide <= current.lowestTide ? previous : current)
    const highestSpotTide = spots.reduce((previous, current) => previous.lowestTide >= current.lowestTide ? previous : current)
    const lowestTide = lowestSpotTide.lowestTide
    const highestTide = highestSpotTide.highestTide
    let tooLowTooHigh = "" 
      if ((tideData.data[selectedForecastIndex].sg + msl) < lowestTide) {tooLowTooHigh = "The tide is probably too low for most spots at that time"} 
      else if ((tideData.data[selectedForecastIndex].sg + msl) > highestTide) {tooLowTooHigh = "The tide is probably too high for most spots at that time"}  
    const droppingOrRising = tideData.data[selectedForecastIndex].sg > tideData.data[selectedForecastIndex + 1].sg ? "(dropping)" :  "(rising)"  

    //WAVES DISPLAY
    const waves: number = apiData.hours[selectedForecastIndex].waveHeight.sg
    const period: number = apiData.hours[selectedForecastIndex].swellPeriod.sg
    let wavesComment = "might be worth a look..."
    if (waves < smallWave && period < shortPeriod) {wavesComment = "look really small..."} 
    else if (waves > bigWave && period > longPeriod) {wavesComment = "could be massive! Maybe stick to Capbreton"} 
    else if (waves > (smallWave + 0.2) && period > (shortPeriod + 1)) {wavesComment = "might well be cooking, if the wind plays ball!"}
    
    //WIND DISPLAY
    const wind = ((apiData.hours[selectedForecastIndex].windSpeed.sg).toFixed(0)  * 3.6)
    const windDirection: number = (apiData.hours[selectedForecastIndex].windDirection.sg).toFixed(0)
    let windComment = "moderate"
    if (wind < lightWind) {windComment = "light"}
    else if (wind > strongWind) {windComment = "strong"}
    let windDirectionComment = "cross-shore"
    if (windDirection > goodWindStart && windDirection < goodWindEnd) {windDirectionComment = "offshore"}
    else if (windDirection > badWindStart && windDirection < badWindEnd) {windDirectionComment = "onshore"}

    //SET THE DISPLAY
    let selectedSpotsDisplay: JSX.Element[] = []
    let count = 0 
    selectedSpots.forEach((item) => selectedSpotsDisplay.push(<li key={count++} className="list-disc ml-6 text-xl font-bold text-red-500" >{item.name} (tide range: {item.lowestTide} to {item.highestTide}m)</li>))
    let forecastBreakdown: JSX.Element[] = []
    forecastBreakdown.push(
      <div className="w-fit mx-auto px-[2%]">
        <h1 className="font-bold text-xl">{time < 12 ? time + "am" : time + "pm"} {dateDisplay}</h1>
        <p className="text-xl font-bold text-red-500">The waves {wavesComment}</p>
        <p className="text-xl font-bold text-red-500">The wind is {windComment} {windDirectionComment}</p>
        <p className="text-xl">Tide: {(tideData.data[selectedForecastIndex].sg + msl).toFixed(2)}m {droppingOrRising}</p>
        <p className="text-xl ">Maybe try:</p>
        <ul className="list-disc"> 
          {selectedSpotsDisplay}
          {tooLowTooHigh !== "" && <li key="tooLowTooHigh">{tooLowTooHigh}</li>}
        </ul>
        <br></br>
        <p className="font-bold text-xl">Forecast overview: {time < 12 ? time + "am" : time + "pm"} {dateDisplay}</p>
        <p className="text-xl">Wave height: {waves.toFixed(2)}m</p>
        <p className="text-xl">Period: {period.toFixed(0)}s</p>
        <p className="text-xl">Swell direction: <FaArrowDownLong className="inline" style={{transform: `rotate(${apiData.hours[selectedForecastIndex].swellDirection.sg}deg)`}}/></p>
        <p className="text-xl">Wind speed: {wind} km/h</p>
        <p className="text-xl">Wind direction: <FaArrowDownLong className="inline" style={{transform: `rotate(${apiData.hours[selectedForecastIndex].windDirection.sg}deg)`}}/></p>
        <p className="text-xl">First light: {timeArranger(dayLengthData.results[selectedValue].dawn)}</p>
        <p className="text-xl">Sunrise: {timeArranger(dayLengthData.results[selectedValue].sunrise)}</p>
        <p className="text-xl">Sunset: {timeArranger(dayLengthData.results[selectedValue].sunset)}</p>
        <p className="text-xl">Last light: {timeArranger(dayLengthData.results[selectedValue].dusk)}</p>
      </div>
    )  
    setSelectedForecast(forecastBreakdown)
  }
  
  return (
    <div className={siteDisplay === WHERE ? "contents w-[98%] max-w-[800px] mx-auto" : "hidden"}>
      <div className="min-h-screen">
        <p className="text-center my-4 font-bold text-3xl">{WHERE}</p>
        <form>
          <p className="text-xl text-center">Select the day you want to surf.</p>
          <form className="w-fit mx-auto">
            <label className="w-fit mr-2 text-xl font-bold" htmlFor="day">Day:</label>
            <select className="text-lg text-center w-fit my-4 border border-yellow-500 hover:border-slate-500" name="day" id="day-selector" onClick={setTimes} required>
              <option value="5">Select a day</option>
              <option value="0">{firstApiDate}</option>
              <option value="1">{secondApiDate}</option>
              <option value="2">{thirdApiDate}</option>
              <option value="3">{fourthApiDate}</option>
              <option value="4">{fifthApiDate}</option>
            </select>
          </form>
          <p className="text-xl text-center">Then select the time (between first and last light).</p>
          <div className="w-fit mx-auto"> 
            <label className="w-fit mr-2 text-xl font-bold" htmlFor="time">Time:</label>
            <select className="text-lg text-center w-fit my-4 border border-yellow-500 hover:border-slate-500" name="time" id="time-selector" required>
              {surfHours?.length === 0 ? <option key="first-option" value="first-option">First select a day</option> : surfHours}
            </select>           
          </div>
          <button className="w-fit block mx-auto mt-1 p-2 font-bold text-xl text-red-950 border-2 border-yellow-500 rounded-3xl hover:border-red-950 hover:bg-slate-200" onClick={(event) => showWhere(event)}>Show me where!</button>
        </form>
        <br></br>
        {selectedForecast}
        <br></br>
      </div>
      <Corrections />
    </div>
  )
}

export default WhereToSurf
