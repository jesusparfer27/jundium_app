import { Outlet } from "react-router-dom"
import { HeaderProvider } from "./context/HeaderContext"
import Header from "./components/header/Header"
import './css/pages/homepage.css'


function App() {

  return (
    <>
      <HeaderProvider>
        <Header />
        <Outlet />
      </HeaderProvider>
    </>
  )
}

export default App
