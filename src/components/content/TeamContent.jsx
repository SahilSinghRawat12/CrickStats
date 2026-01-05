import React, { useState } from 'react'
import { CiSquarePlus } from "react-icons/ci";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { NavLink } from 'react-router-dom';



const TeamContent = () => {

    
  return (
    <div className='w-full pl-16 '>
        <div className='flex items-center w-[80%] mt-10 justify-between'>
            <h1 className='text-3xl font-bold'>Teams</h1>

            <button className='flex cursor-pointer  bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md items-center gap-x-2'>
                <CiSquarePlus color='white' size={23} />
                 <span>ADD TEAM</span>
            </button>
        </div>

        <div className='mt-12 flex flex-col w-[80%]   gap-y-5 '>
          <NavLink to='/teams/teamdetails'>
            <div className='flex justify-between cursor-pointer bg-white border border-b-gray-300 shadow-sm rounded-md items-center px-5 py-2'>
                <div className=''>
                   <h2 className='text-md font-semibold'>Delhi Warriors</h2>
                   <span className='text-sm text-gray-800'>11 Players</span>
                </div>

                <div>
                    <MdOutlineKeyboardArrowRight/>
                </div>
            </div>
           </NavLink>

           <NavLink to='/teams/teamdetails'>
            <div className='flex justify-between cursor-pointer bg-white border border-b-gray-300 shadow-sm rounded-md items-center px-5 py-2'>
                <div>
                   <h2 className='text-md font-semibold'>Delhi Warriors</h2>
                   <span className='text-sm text-gray-800'>11 Players</span>
                </div>

                <div>
                    <MdOutlineKeyboardArrowRight/>
                </div>
            </div>
            </NavLink>
        </div>
    </div>
  )
}

export default TeamContent