import React from 'react'
import logo from "../../assests/resize.png"
import { NavLink } from 'react-router-dom'

const Navbar = () => {
  return (
   <nav className=' flex items-center justify-between w-full p-5 '>
    <NavLink to='/'>
          <div className='flex items-center mx-12 cursor-pointer '>
           <img src={logo} alt='logo' className='w-[130px]'/> 
        </div>
     </NavLink>

        <div className='flex items-center mx-8 gap-x-8 '>
           <NavLink to='/login'>
            <button className='bg-[#7c73e6] px-4 py-2 rounded-full font-semibold text-white'>
                Login
            </button>
            </NavLink>
          
          <NavLink to='/register'>
            <button className='bg-[#7c73e6] px-4 py-2 rounded-full font-semibold text-white'>
                Register
            </button>
           </NavLink>
        </div>
   </nav>
  )
}

export default Navbar