import React, { useState } from 'react'
import { CiSquarePlus } from "react-icons/ci";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { NavLink } from 'react-router-dom';



const MatchContent = () => {
  return (
    <div className='w-full pl-16 '>
           <div className='flex items-center w-[80%] mt-10 justify-between'>
               <h1 className='text-3xl font-bold'>Matches</h1>
   
               <button className='flex cursor-pointer  bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md items-center gap-x-2'>
                   <CiSquarePlus color='white' size={23} />
                    <span>ADD Match</span>
               </button>
           </div>
   
           <div className='mt-16 grid grid-cols-3 w-[80%] gap-x-10  '>
              
               <div className='flex flex-col border border-gray-300 justify-center items-center rounded-md bg-white py-10 gap-y-3 shadow-md cursor-pointer'>
                  <span className='text-2xl font-semibold'>MI vs CSK</span>
                  <span className='text-md '>Winner : CSK</span>
                  <NavLink to='/matches/details'>
                  <span className='text-sm  hover:text-blue-900 hover:font-semibold'>View Details</span>
                  </NavLink>
               </div>

               <div className='flex flex-col border border-gray-300 justify-center items-center rounded-md bg-white py-10 gap-y-3 shadow-md cursor-pointer'>
                  <span className='text-2xl font-semibold'>MI vs CSK</span>
                  <span className='text-md '>Winner : CSK</span>
                  <NavLink>
                  <span className='text-sm hover:text-blue-900 hover:font-semibold'>View Details</span>
                  </NavLink>
               </div>

               <div className='flex flex-col border border-gray-300 justify-center items-center rounded-md bg-white py-10 gap-y-3 shadow-md cursor-pointer'>
                  <span className='text-2xl font-semibold'>MI vs CSK</span>
                  <span className='text-md '>Winner : CSK</span>
                  <NavLink>
                  <span className='text-sm  hover:text-blue-900 hover:font-semibold '>View Details</span>
                  </NavLink>
               </div>
           </div>
       </div>
  )
}

export default MatchContent