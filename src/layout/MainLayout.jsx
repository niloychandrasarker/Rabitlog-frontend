import { Outlet } from "react-router-dom";
import Navber from "../componenet/Navber";
import Footer from "../componenet/Footer";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-4 md:px-8 lg:px-32 2xl:px-64 flex-grow">
        <Navber />
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
