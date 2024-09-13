import { useSiteContext } from "../context/ContextProvider"
import { useState } from "react"
import { FaArrowDownLong } from "react-icons/fa6";
import Corrections from "./Corrections";

const WhenToSurf = () => {
  const {WHEN, siteDisplay, dayLengthData, apiData, tideData, spots, msl, utcCorrection, goodWindStart, goodWindEnd, smallWave, shortPeriod} = useSiteContext()
  const [whenDisplay, setWhenDisplay] = useState<JSX.Element[]>()
  const [arrayComment, setArrayComment] = useState<JSX.Element[]>()

  //DATES FOR DISPLAY:
  const firstApiDate = new Date (apiData.hours[12].time).toDateString()
  const secondApiDate = new Date (apiData.hours[36].time).toDateString()
  const thirdApiDate = new Date (apiData.hours[60].time).toDateString()
  const fourthApiDate = new Date (apiData.hours[84].time).toDateString()
  const fifthApiDate = new Date (apiData.hours[108].time).toDateString()

  const showWhen = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setArrayComment([])

    //GET THE DAYLIGHT HOURS DURING THE SELECTED DAY
    const daySelector = document.getElementById("day-selector") as HTMLSelectElement
    if (daySelector === null || Number (daySelector?.value) === 5) {return}
    const selectedValue = Number(daySelector.selectedOptions[0].value)
    const firstLight = dayLengthData.results[selectedValue].dawn
    const lastLight = dayLengthData.results[selectedValue].dusk
    const firstHour = Number(firstLight.slice(1, 2))
    const hoursBefore = selectedValue === 0 ? (firstHour - 1) : ((selectedValue * 24) + (firstHour - 1))
    const lastHour = Number(lastLight.slice(0,2))
    const hoursAfter = selectedValue === 0 ? (lastHour + 1) : (selectedValue * 24) + (lastHour + 1)
    let filteredHours: any[] = []
    apiData.hours.forEach((hour: any) => {if (apiData.hours.indexOf(hour) > hoursBefore && apiData.hours.indexOf(hour) < hoursAfter) {filteredHours.push(hour)}})
    
    //FILTER BY WAVE SIZE AND PERIOD
    const noSmallWaves = filteredHours.filter((hours) => hours.waveHeight.sg > smallWave && hours.swellPeriod.sg > shortPeriod)
    if (noSmallWaves.length === 0) {setDisplay([]); setArrayComment([<p className="w-full text-center text-2xl font-bold text-red-500 px-[2%]">It's really small, there are most likely no waves all day.</p>]); return}
    
    //FILTER BY WIND DIRECTION 
    let goodWinds = noSmallWaves.filter((hours) => hours.windDirection.sg > goodWindStart && hours.windDirection.sg < goodWindEnd)

    //SORT BY WIND STRENGTH
    if (goodWinds.length > 0) {setArrayComment([<p className="w-full text-center text-2xl font-bold text-red-500 px-[2%]">Offshore and waves, nice!</p>]); setDisplay(goodWinds)}
    else {  
      let sortByWindStrength = noSmallWaves.sort((previous, current) => previous.windSpeed.sg - current.windSpeed.sg)
      setArrayComment([<p className="w-full text-center text-2xl font-bold text-red-500 px-[2%]">Wind direction is a problem all day, these are the times with waves ranked from lightest to strongest wind speed:</p>])
      setDisplay(sortByWindStrength)
    }
  }

  const setDisplay = (array: any[]) => {
    let selectedTimesDisplay: JSX.Element[] = []
    if (array.length < 1) {setWhenDisplay(selectedTimesDisplay); return}

    for (let i = 0; i < array.length; i++ ) {
      let tideHeightIndex: number = tideData.data.findIndex((hours: any) => hours.time === array[i].time)
      let tideHeight: number = tideData.data[tideHeightIndex].sg
      let droppingOrRising = tideData.data[tideHeightIndex].sg > tideData.data[tideHeightIndex + 1].sg ? "(dropping)" :  "(rising)"
      let spotFilter = spots.filter((tide) => (tideHeight + msl).toFixed(2) > tide.lowestTide.toFixed(2) && (tideHeight + msl).toFixed(2) < tide.highestTide.toFixed(2))
      let selectedSpotsDisplay: JSX.Element[] = []
      let spotCount = 0 
      spotFilter.forEach((item) => {selectedSpotsDisplay.push(<li className="list-disc ml-6 text-xl font-bold text-red-500" key={spotCount++}>{item.name} (tide range: {item.lowestTide} to {item.highestTide}m)</li>)})
      if (selectedSpotsDisplay.length === 0) {selectedSpotsDisplay.push(<li className="list-disc ml-6 text-xl font-bold text-red-500" key="unique">Probably not many good options at this tide...</li>)}
      const dateDisplay = new Date(array[i].time).toDateString()
      const time = Number (array[i].time.slice(11, 13)) + utcCorrection

      selectedTimesDisplay.push(
        <div className="w-fit mx-auto px-[2%]" key={i}>
          <br></br>
          <p className="font-bold text-xl mb-1">{time < 12 ? time + "am" : time + "pm"} {dateDisplay}</p>
          <p className="text-xl">Tide: {(tideData.data[tideHeightIndex].sg + msl).toFixed(2)} m {droppingOrRising}</p>
          <p className="text-xl">Maybe try:</p>
          <ul className="list-disc">{selectedSpotsDisplay}</ul>
          <p className="text-xl">Wave height: {(array[i].waveHeight.sg).toFixed(2)}m</p>
          <p className="text-xl">Period: {(array[i].swellPeriod.sg).toFixed(0)}s</p>
          <p className="text-xl">Wind speed: {array[i].windSpeed.sg} km/h</p>
          <p className="text-xl mb-2">Wind direction: <FaArrowDownLong className="inline" style={{transform: `rotate(${array[i].windDirection.sg}deg)`}}/></p>
          <hr className="w-full"></hr>        
        </div>
      )
    }
    setWhenDisplay(selectedTimesDisplay)
  }

  return (
    <div className={siteDisplay === WHEN ? "contents min-h-screen" : "hidden"}>
      <div className="min-h-screen">
        <p className="text-center my-4 font-bold text-3xl">{WHEN}</p>
        <p className="text-xl text-center max-w-[800px] mx-auto px-2">Select the day you want to surf in the next 5 days, the app will tell you where and when to surf on that day (between first and last light).</p>
        <form className="w-fit mx-auto">
          <label className="w-fit mr-2 text-xl font-bold" htmlFor="day">Day:</label>
          <select className="text-lg text-center w-fit my-4 border border-yellow-500 hover:border-slate-500" name="day" id="day-selector" required>
            <option value="5">Select a day</option>
            <option value="0">{firstApiDate}</option>
            <option value="1">{secondApiDate}</option>
            <option value="2">{thirdApiDate}</option>
            <option value="3">{fourthApiDate}</option>
            <option value="4">{fifthApiDate}</option>
          </select>
          <br></br>
          <button className="w-fit block mx-auto mt-1 p-2 font-bold text-xl text-red-950 border-2 border-yellow-500 rounded-3xl hover:border-red-950 hover:bg-slate-200" onClick={(event) => showWhen(event)}>Show me where and when!</button>
        </form>
        <br></br>
        {arrayComment}
        {whenDisplay}
        <br></br>
      </div>
      <Corrections />
    </div>
  )
}

export default WhenToSurf
