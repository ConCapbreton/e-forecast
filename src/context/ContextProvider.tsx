import { createContext, useContext, ReactElement, useState, useEffect, useRef } from "react"

type Spots = { name: String,
  highestTide: number,
  lowestTide: number,
}

type ContextProps = {
  MAINPAGE: string,
  FORECAST: string,
  WHERE: string,
  WHEN: string,
  siteDisplay: string,
  setSiteDisplay: React.Dispatch<React.SetStateAction<string>>,
  apiData: any, 
  setApiData: React.Dispatch<React.SetStateAction<any>>,
  tideData: any,
  setTideData: React.Dispatch<React.SetStateAction<any>>,
  dayLengthData: any,
  setDayLengthData: React.Dispatch<React.SetStateAction<any>>,
  errorMsg: string[],
  setErrorMsg: React.Dispatch<React.SetStateAction<string[]>>,
  isLoading: boolean,
  spots: Spots[],
  utcCorrection: number, 
  msl: number,
  goodWindStart: number, 
  goodWindEnd: number,
  badWindStart: number,
  badWindEnd: number,
  lightWind: number,
  strongWind: number, 
  smallWave: number,
  bigWave: number,
  shortPeriod: number,
  longPeriod: number, 
}

const InitialValues: ContextProps = {
  MAINPAGE: "Enhanced Forecast",
  FORECAST: "Forecast",
  WHERE: "Where to Surf?",
  WHEN: "When to Surf?",
  siteDisplay: "Enhanced Forecast",
  setSiteDisplay: () => {},
  apiData: {},
  setApiData: () => {},
  tideData: {},
  setTideData: () => {},
  dayLengthData: {},
  setDayLengthData: () => {},
  errorMsg: [],
  setErrorMsg: () => {},
  isLoading: false,
  spots: [{
    name: "",
    highestTide: 0,
    lowestTide: 0,
  }],
  utcCorrection: 0,
  msl: 0,
  goodWindStart: 0, 
  goodWindEnd: 0,
  badWindStart: 0,
  badWindEnd: 0,
  lightWind: 0,
  strongWind: 0, 
  smallWave: 0,
  bigWave: 0,
  shortPeriod: 0,
  longPeriod: 0, 
}

const SiteContext = createContext(InitialValues)
type ChildrenType = {children?: ReactElement | ReactElement[]}

const ContextProvider = ({children}: ChildrenType) => {
  //API CALLS

  // TO BE MOVED OUT WHEN DEPLOYING TO THE INTERNET
  const APIKEY = import.meta.env.VITE_STORMGLASS_API_KEY
  
  const [apiData, setApiData] = useState() 
  const [tideData, setTideData] = useState()
  const [dayLengthData, setDayLengthData] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string[]>([])
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect (() => {
    
    const dateArranger = (dateString: string): string => {
      const dateArray = dateString.split("")
      const rearrangedArray = [dateArray[6], dateArray[7], dateArray[8], dateArray[9], "-", dateArray[3], dateArray[4], "-", dateArray[0], dateArray[1]]
      const formattedDateString = rearrangedArray.join("")
      return formattedDateString
    }
    //TODAY
    let date = new Date();
    let dateString = date.toLocaleDateString()
    let formattedDateString = dateArranger(dateString)
    //TODAY + 5 days
    let datePlusFive = new Date(date.setDate(date.getDate()+5))
    let datePlusFiveString = datePlusFive.toLocaleDateString()
    let formattedDatePlusFiveString = dateArranger(datePlusFiveString)

    const lat = 43.656221
    const lng = -1.452766
    const params = "waterTemperature,swellPeriod,swellDirection,swellHeight,waveHeight,windSpeed,windDirection,airTemperature,gust,seaLevel"
    const url = `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=${params}&key=${APIKEY}`
    const tideUrl = `https://api.stormglass.io/v2/tide/sea-level/point?lat=${lat}&lng=${lng}&key=${APIKEY}`
    const dayLengthUrl = `https://api.sunrisesunset.io/json?lat=${lat}&lng=${lng}&timezone=UTC&date_start=${formattedDateString}&date_end=${formattedDatePlusFiveString}&time_format=military`

    const fetchAPIData = async () => {
      abortControllerRef.current?.abort()
      abortControllerRef.current = new AbortController()
      setIsLoading(true)

      // IS THE DATA CACHED AND IS IT FROM TODAY? 
      if (localStorage.getItem("storedApiData") && localStorage.getItem("storedTideData") && localStorage.getItem("storedDayLengthData")) {
        const getStoredApiData = JSON.parse(localStorage.getItem("storedApiData") as string)
        const getStoredTideData = JSON.parse(localStorage.getItem("storedTideData") as string)
        const getStoredDayLengthData = JSON.parse(localStorage.getItem("storedDayLengthData") as string)
        if (getStoredApiData.errors) {setErrorMsg(["Clicking the Reload button should hopefully fix this error!"]); setIsLoading(false);}      
        let apiDate = getStoredApiData.meta.start
        let cutApiDate = apiDate.slice(0, 10)
        if (formattedDateString === cutApiDate) {
          setApiData(getStoredApiData) 
          setTideData(getStoredTideData)
          setDayLengthData(getStoredDayLengthData)
          setIsLoading(false)
          console.log("Data from Cache")
          return
        }
      }
      // CACHED DATA DOESNT EXIST / OUT OF DATE -> CLEAR LOCAL STORAGE AND CALL DATA FROM API 
      localStorage.clear() 
      try {
        const response = await fetch(url, {signal: abortControllerRef.current?.signal});
        const apiRes = (await response.json())
        const tideResponse = await fetch(tideUrl, {signal: abortControllerRef.current?.signal});
        const tideRes = (await tideResponse.json()) 
        const dayLengthResponse = await fetch(dayLengthUrl)
        const dayLengthData = (await dayLengthResponse.json()) 
        localStorage.setItem("storedApiData", JSON.stringify(apiRes))
        localStorage.setItem("storedTideData", JSON.stringify(tideRes))
        localStorage.setItem("storedDayLengthData", JSON.stringify(dayLengthData))
        setApiData(apiRes)
        setTideData(tideRes)
        setDayLengthData(dayLengthData)
        console.log("Data from API")
      } catch (error: any) {
        if (error.name === "AbortError") {return}
        let atLeastOneError: string
        if (error.message) {atLeastOneError = error.message}
        else if (error.errors.key) {atLeastOneError = error.errors.key}
        else {atLeastOneError = "There was an error!"}
        console.error(error)
        setErrorMsg([atLeastOneError])
      } finally {
        if (errorMsg.length > 0) {localStorage.clear()}
        setIsLoading(false)
      }
    };
    fetchAPIData();
  }, [])

  //SPOTS (TIDE DATA FOR CAPBRETON: AVERAGE MOST EXTREME [0.36, 4.08] range 3.72, AVERAGE LEAST EXTREME [1.58, 2.88] range 1.3. MID-TIDE: [2.22]): 
  type Spots = { 
    name: string,
    highestTide: number,
    lowestTide: number,
  }

  const spots: Spots[] = [
    {
      name: "Prevent",
      highestTide: 2.5,
      lowestTide: 1,
    },
    {
      name: "Santocha",
      highestTide: 2.22,
      lowestTide: 0,
    },
    {
      name: "La Piste / VVF",
      highestTide: 3,
      lowestTide: 2.22,
    },
    {
      name: "La Graviere",
      highestTide: 3,
      lowestTide: 2.22,
    },
    {
      name: "Estagnots / Culs Nuls ",
      highestTide: 2.22,
      lowestTide: 0,
    },
  ]

  // UTC AND MSL CORRECTIONS AND CONSTANTS
  let localTime = new Date()
  let localHour = localTime.getHours()
  let utcHour = localTime.getUTCHours()
  let utcCorrection: number 
  if (localHour - utcHour > 2 || localHour - utcHour < 0) {utcCorrection = 0}
  else {utcCorrection = localHour - utcHour} 
  
  const msl = 1.85727272727273

  const goodWindStart = 45
  const goodWindEnd = 135
  const badWindStart = 225
  const badWindEnd = 315
  const lightWind = 8
  const strongWind = 15
  const smallWave = 0.5
  const bigWave = 1.5
  const shortPeriod = 7 
  const longPeriod = 12

  // CATEGORY TITLES

  const MAINPAGE = "Enhanced Forecast"
  const FORECAST = "Forecast"
  const WHERE = "Where to Surf?"
  const WHEN = "When to Surf?"

  const [siteDisplay, setSiteDisplay] = useState<string>(MAINPAGE)

  return (
    <SiteContext.Provider value={{MAINPAGE, FORECAST, WHERE, WHEN, siteDisplay, setSiteDisplay, apiData, setApiData, tideData, setTideData, dayLengthData, setDayLengthData, errorMsg, setErrorMsg, isLoading, spots, utcCorrection, msl, goodWindStart, goodWindEnd, badWindStart, badWindEnd, lightWind, strongWind, smallWave, bigWave, shortPeriod, longPeriod}}>
      {children}
    </SiteContext.Provider>
  )
}

export default ContextProvider

export const useSiteContext = () => useContext(SiteContext)