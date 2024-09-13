import { useSiteContext } from "../context/ContextProvider"


const Header = () => {
    const { MAINPAGE, FORECAST, WHEN, WHERE, setSiteDisplay} = useSiteContext()     
    
    const mainpageTailwind = "w-fit block mx-auto py-2 font-bold text-xl hover:text-yellow-400 sm:text-3xl"
    const activeMainpageTailwind = "w-fit block mx-auto py-2 font-bold text-xl text-yellow-400 sm:text-3xl"

    const navBtnTailwind = "px-[5px] pb-[2px] block border-white border-2 rounded-xl hover:text-yellow-400 sm:min-w-[200px] sm:text-2xl"
    const activeBtnTailwind = "px-[5px] pb-[2px] block border-yellow-400 text-yellow-400 border-2 rounded-xl sm:min-w-[200px] sm:text-2xl"
    
    const navBtn = (event: React.MouseEvent<HTMLButtonElement>) => {
      const btn1 = document.getElementById("nav-btn1") as HTMLButtonElement
      btn1.setAttribute("class", mainpageTailwind)
      const btn2 = document.getElementById("nav-btn2") as HTMLButtonElement
      btn2.setAttribute("class", navBtnTailwind)
      const btn3 = document.getElementById("nav-btn3") as HTMLButtonElement
      btn3.setAttribute("class", navBtnTailwind)
      const btn4 = document.getElementById("nav-btn4") as HTMLButtonElement
      btn4.setAttribute("class", navBtnTailwind)

      const target = event.target as HTMLButtonElement
      target.innerText === MAINPAGE ? target.setAttribute("class", activeMainpageTailwind) : target.setAttribute("class", activeBtnTailwind)
      
      setSiteDisplay(target.innerText)
    }
    

  return (
    <div className="w-full bg-BGC sticky h-20 text-white sm:h-24">
      <button id="nav-btn1" className={activeMainpageTailwind} translate="no" onClick={(event) => navBtn(event)}>{MAINPAGE}</button>
      <div className="w-full flex flex-row justify-evenly items-center">
        <button id="nav-btn2" className={navBtnTailwind} translate="no" onClick={(event) => navBtn(event)}>{FORECAST}</button>
        <button id="nav-btn3" className={navBtnTailwind} translate="no" onClick={(event) => navBtn(event)}>{WHERE}</button>
        <button id="nav-btn4" className={navBtnTailwind} translate="no" onClick={(event) => navBtn(event)}>{WHEN}</button>
      </div>
    </div>
  )
}

export default Header
