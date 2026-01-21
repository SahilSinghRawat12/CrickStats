import React, { useContext, useState } from 'react'
import { CiSquarePlus } from "react-icons/ci";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { NavLink, useNavigate } from 'react-router-dom';
import defaultImage from "../../assests/image.png"
import { teamsNames } from '../../data/data.js';
import { AppContext } from '../../context/AppContext.jsx';



const TeamContent = () => {

  const {state} = useContext(AppContext);
  const navigate = useNavigate();
    
  return (
    <div className='w-full pl-16 '>
        <div className='flex items-center w-[80%] mt-10 justify-between'>
            <h1 className='text-3xl font-bold'>Teams</h1>

             
            <button className='flex cursor-pointer  bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md items-center gap-x-2'
            onClick={()=> navigate('/teams/addteam')}>
                <CiSquarePlus color='white' size={23} />
                 <span>ADD TEAM</span>
            </button>
          
        </div>

        <div className='mt-12 flex flex-col w-[80%]   gap-y-5 '>
 
          {
            state.teams.map( (team)=> (
            
            <div key={team.id} className='flex justify-between cursor-pointer bg-white border border-b-gray-300 shadow-sm rounded-md items-center px-5 py-2'
             onClick={()=> navigate('/teams/teamdetails')}>
             
             <div className='flex gap-5' >
                    <img src={defaultImage} alt='logo' className='w-10 h-10 rounded-full'/>
                <div>
                   <h2 className='text-md font-semibold'>{team.teamName}</h2>
                   <span className='text-sm text-gray-800'>{team.totalPlayers} Players</span>
                </div>
             </div>

                <div>
                    <MdOutlineKeyboardArrowRight/>
                </div>
            </div>
             
            ))  
          }

        </div>
    </div>
  )
}

export default TeamContent