import React from 'react'
import Logo from "../assets/Logo.png"
import { useNavigate } from "react-router";

const Header = () => {
      const navigate = useNavigate();
  return (
    <div className='w-full bg-[#1b4965] min-h-20 flex flex-row p-4'>
        <img src={Logo} alt='logo' className='h-[50px] w-[200px] cursor-pointer' onClick={()=>{  navigate("/Home");}}></img>
    </div>
  )
}

export default Header