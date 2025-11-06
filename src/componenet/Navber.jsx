import { useState } from "react";
import Image from "./Image";
import { Link } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  useAuth,
  UserButton,
} from "@clerk/clerk-react";
import { useEffect } from "react";

const Navber = () => {
  const [Open, setOpen] = useState(false);

  const {getToken} = useAuth();
  useEffect(() => {
    getToken().then((token) => {
      console.log("Clerk Token:", token);
    });

  }, []);

  return (
    <div className=" w-full h-16 md:h-20 flex items-center justify-between ">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
        <Image src="rabit2.png" alt="Logo" w={36} h={36} />

        <span>Rabitlog</span>
      </Link>
      {/* Mobile Menu */}
      {/* mobile button  */}
      <div className="md:hidden">
        <div className="text-3xl cursor-pointer" onClick={() => setOpen(!Open)}>
          {Open ? "X" : "☰"}
        </div>
        {/* Mobile link list */}
        <div
          className={`w-full h-screen flex flex-col items-center justify-center gap-8 font-medium text-xl absolute top-16  transition-all ease-in-out 
          ${Open ? "-right-0" : " -right-[100%]"}`}
        >
          <Link to="/">Home</Link>
          <Link to="/">Trending</Link>
          <Link to="/">Most Popular</Link>
          <Link to="/">About</Link>
          <Link to="/">
            <button className="py-2 px-4 rounded-3xl bg-blue-800 text-white">
              Login👋
            </button>
          </Link>
        </div>
      </div>
      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-8 xl:gap-12  font-medium">
        <Link to="/">Home</Link>
        <Link to="/">Trending</Link>
        <Link to="/">Most Popular</Link>
        <Link to="/">About</Link>

        <SignedOut>
          <Link to="/login">
            <button className="py-2 px-4 rounded-3xl bg-blue-800 text-white">
              Login👋
            </button>
          </Link>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
};

export default Navber;
