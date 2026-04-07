import React from 'react'
import logo from '../../assests/resize.png'
import logoIcon from '../../assests/iconlogo.png'
import {navItems} from "../../data/data.js"
import { NavLink } from 'react-router-dom'
import { IoMenu } from "react-icons/io5";

const Sidebar = ({isOpen , setIsOpen}) => { 

  function toggleNav(){
     setIsOpen(!isOpen);
  }

  return (
    <>
      {/*  MOBILE NAVBAR */}
      <div className="md:hidden w-full bg-[#f2f4f6] flex items-center justify-between px-4 py-3 shadow fixed top-0 left-0 z-50">
        
        <img src={logoIcon} className="w-[40px]" />

        <IoMenu size={28} className="cursor-pointer" onClick={toggleNav}/>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {isOpen && (
        <div className="md:hidden fixed top-[60px] left-0 w-full bg-[#f2f4f6] shadow z-40">
          <ul className="flex flex-col p-4 gap-4">
            {
              navItems.map((item , index) => (
                <NavLink 
                  to={item.href} 
                  key={index}
                  onClick={() => setIsOpen(false)}
                  className={({isActive}) =>
                    isActive ? "bg-[#38598b] text-white rounded-md" : ""
                  }
                >
                  <li className="flex items-center gap-4 p-3 hover:bg-[#38598b] hover:text-white rounded-md">
                    <item.icons size={22}/>  
                    <span>{item.title}</span>
                  </li>
                </NavLink>
              ))
            }
          </ul>
        </div>
      )}

      {/*  DESKTOP SIDEBAR */}
      <nav className={`
        hidden md:block bg-[#f2f4f6] h-screen fixed top-0 left-0 transition-all duration-300
        ${isOpen ? 'w-[250px]' : 'w-[80px]'}
      `}>

        <div className='flex justify-end p-2 cursor-pointer font-bold' onClick={toggleNav}>
          <IoMenu size={28} className="cursor-pointer" onClick={toggleNav}/>
        </div>

        <NavLink to='/'>
          <div className='p-4'>
            {
              isOpen 
              ? <img src={logo} className='w-[150px]' /> 
              : <img src={logoIcon} className='w-[40px]' />
            }
          </div>
        </NavLink>
        
        <ul className={`flex flex-col gap-y-6 ${isOpen ? 'px-6 mt-5' : 'px-3 mt-7'}`}>
          {
            navItems.map((item , index) => (
              <NavLink 
                to={item.href} 
                key={index}
                className={({isActive}) =>
                  isActive ? "bg-[#38598b] text-white rounded-md" : ""
                }
              >
                <li className={`flex items-center gap-4 hover:bg-[#38598b] hover:text-white rounded-md
                  ${isOpen ? 'p-4' : 'p-3 justify-center'}
                `}>
                  <item.icons size={22}/>  
                  {isOpen && <span>{item.title}</span>}
                </li>
              </NavLink>
            ))
          }
        </ul>
      </nav>
    </>
  )
}

export default Sidebar