import { useSiteContext } from "../context/ContextProvider"



const MainPage = () => {
  const {MAINPAGE, siteDisplay} = useSiteContext()

  
  const liFormat = "text-xl hover:text-sky-900 hover:underline hover:text-[1.3rem] underline-offset-[3px] "

  return (
    <div className={siteDisplay === MAINPAGE ? "contents, w-[95%] max-w-[900px] mx-auto" : "hidden"}>
      <br></br>
      <h1 className="text-center font-bold text-3xl ">Surf forecasting for the spots around Capbreton, Hossegor and Seignosse.</h1>
      <br></br>
      <p className="text-center text-2xl ">This page will help you decide when and where to surf for the best conditions.</p>
      <br></br>
      <p className="w-full text-center text-xl mb-4 ">Here are the links to a few useful webcams:</p>
      <ul className="w-fit mx-auto list-disc list-inside ">
        <li className={liFormat}><a href="https://gosurf.fr/webcam/fr/19/Capbreton-Plage-du-Prevent" target="_blank">Prevent</a></li>
        <li className={liFormat}><a href="https://gosurf.fr/webcam/fr/83/Capbreton-Plage-du-Santosha-de-La-Piste" target="_blank">Santocha</a></li>
        <li className={liFormat}><a href="https://gosurf.fr/webcam/fr/79/Seignosse-Plage-des-Bourdaines-Plage-des-Estagnots" target="_blank">Estagnots</a></li>
      </ul>
      <br></br>
      <p className="w-full text-center text-xl mb-4 ">Big thanks to these two sites for all the data!</p>
      <ul className="w-fit mx-auto list-disc list-inside ">
        <li className={liFormat}><a href="https://stormglass.io/" target="_blank">stormglass.io</a></li>
        <li className={liFormat}><a href="https://sunrisesunset.io/" target="_blank">sunrisesunset.io</a></li>
      </ul>
      <br></br>
      <div className="group w-fit mx-auto mb-8 flex flex-row font-bold italic text-4xl text-sky-900 ">
        <p className="group-hover:animate-[wave_1s_linear]">H</p>
        <p className="group-hover:animate-[wave_1s_linear_200ms]">a</p>
        <p className="group-hover:animate-[wave_1s_linear_300ms]">p</p>
        <p className="group-hover:animate-[wave_1s_linear_400ms]">p</p>
        <p className="group-hover:animate-[wave_1s_linear_500ms]">y</p>
        <p className="text-transparent">0</p>
        <p className="group-hover:animate-[wave_1s_linear_600ms]">s</p>
        <p className="group-hover:animate-[wave_1s_linear_700ms]">u</p>
        <p className="group-hover:animate-[wave_1s_linear_800ms]">r</p>
        <p className="group-hover:animate-[wave_1s_linear_900ms]">f</p>
        <p className="group-hover:animate-[wave_1s_linear_1000ms]">i</p>
        <p className="group-hover:animate-[wave_1s_linear_1100ms]">n</p>
        <p className="group-hover:animate-[wave_1s_linear_1200ms]">g</p>
        <p className="group-hover:animate-[wave_1s_linear_1300ms]">!</p>
      </div>
    </div>
  )
}

export default MainPage
