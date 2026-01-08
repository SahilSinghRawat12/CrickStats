import React, { useState } from 'react'
import { CiSquarePlus } from "react-icons/ci";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { NavLink } from 'react-router-dom';
import defaultImage from "../../assests/image.png"
import { teamsNames } from '../../data/data.js';



const TeamContent = () => {

    
  return (
    <div className='w-full pl-16 '>
        <div className='flex items-center w-[80%] mt-10 justify-between'>
            <h1 className='text-3xl font-bold'>Teams</h1>

            <NavLink to='/teams/addteam'>
            <button className='flex cursor-pointer  bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md items-center gap-x-2'>
                <CiSquarePlus color='white' size={23} />
                 <span>ADD TEAM</span>
            </button>
            </NavLink>
        </div>

        <div className='mt-12 flex flex-col w-[80%]   gap-y-5 '>
 
          {
            teamsNames.map( (team , index)=> (
            <NavLink to='/teams/teamdetails' key={index}>
            <div className='flex justify-between cursor-pointer bg-white border border-b-gray-300 shadow-sm rounded-md items-center px-5 py-2'>
             
             <div className='flex gap-5' key={index}>
                    <img src={defaultImage} alt='logo' className='w-10 h-10 rounded-full'/>
                <div>
                   <h2 className='text-md font-semibold'>{team.teamName}</h2>
                   <span className='text-sm text-gray-800'>{team.totalPlayers}</span>
                </div>
             </div>

                <div>
                    <MdOutlineKeyboardArrowRight/>
                </div>
            </div>
            </NavLink>
            ))  
          }

        </div>
    </div>
  )
}

export default TeamContent