import { Outlet } from "react-router-dom"
import Navber from "../componenet/Navber"

const MainLayout = () => {
  return (
    <div className='px-4 md:px-8 lg:px-16 lg:px-32 2xl:px-64'>
      <Navber/>
      <Outlet/>
    </div>
  )
}

export default MainLayout