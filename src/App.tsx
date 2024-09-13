import ContextProvider from "./context/ContextProvider"
import Header from "./components/Header"
import Display from "./components/Display"

function App() {
  
  return (
    <>
      <ContextProvider>
        <Header />      
        <Display />
      </ContextProvider>
    </>
  )
}

export default App
