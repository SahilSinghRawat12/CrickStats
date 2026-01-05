import React, { useState } from 'react'
import logo from '../../assests/resize.png'
import logoIcon from '../../assests/iconlogo.png'
import {navItems} from "../../data/data.js"
import { NavLink } from 'react-router-dom'
import { IoMdArrowDroprightCircle } from "react-icons/io";
import { IoMdArrowDropleftCircle } from "react-icons/io";


const Sidebar = ({isOpen , setIsOpen}) => { 

  function toggleNav(){
     setIsOpen(!isOpen);
  }

  return (
    <nav className={`bg-[#f2f4f6] h-[100vh] fixed top-0 left-0  
     ${isOpen ? 'w-[250px]' : 'w-[100px]'}
    `}>

      <div className='flex justify-end cursor-pointer' onClick={toggleNav}>
           { 
              isOpen ? 
              (<IoMdArrowDropleftCircle size={25} className=''/>) :
              (<IoMdArrowDroprightCircle size={25}/>)
            }
      </div>

      <NavLink to='/'>
       <div className='p-5'>
            {
               isOpen  ? (<img src={logo} alt="" className='w-[170px] transition-all duration-300 ' />) 
               : (<img src={logoIcon} alt="" className='w-[50px] transition-all duration-300' />)
            }
       </div>
      </NavLink>
      
        <ul className={`  h-full flex flex-col gap-y-8 transition-all duration-300  ${isOpen ? 'px-8 mt-5' : 'px-6 mt-7'}`}>
            {
                navItems.map( (item , index) => (
                  <NavLink to={item.href} key={index}
                   className={({isActive})=>
                       isActive ? "bg-[#38598b] rounded-md text-white  " : ""
                  }
                  >
                  <li className={`flex items-center hover:bg-[#38598b] hover:text-white hover:rounded-md gap-5 transition-all duration-200
                   ${isOpen ? '  p-5' : 'p-3 '} 
                    `}>
                      
                      <item.icons size={26}/>  
                      
                      {
                        isOpen && (<span className={`text-[15px] font-medium whitespace-nowrap transition-opacity duration-300
                ${isOpen ? 'opacity-100 delay-200' : 'opacity-0'}`}>{item.title}</span>)
                      }
                  </li>
                </NavLink>
                ))
            }
        </ul>
    </nav>
  )
}

export default Sidebar