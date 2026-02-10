import React, { useContext, useState } from 'react'
import { CiSquarePlus } from "react-icons/ci";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';



const MatchContent = () => {

    const {state , dispatch} = useContext(AppContext);
    const navigate = useNavigate();
    
    

 

  return (
    <div className='w-full pl-16 '>
           <div className='flex items-center w-[80%] mt-10 justify-between'>
               <h1 className='text-3xl font-bold'>Matches</h1>
   
               <button className='flex cursor-pointer  bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md items-center gap-x-2'
               onClick={()=> navigate('/matches/create_match')}>
                   <CiSquarePlus color='white' size={23} />
                    <span>ADD Match</span>
               </button>
           </div>
   
           <div className='mt-16 grid grid-cols-3 w-[80%] gap-x-10  '>      
                 
               {
                  state.matches.map( (match) =>  {
                    const teamA = state.teams.find( (team) => team.id === match.teamAId);
                    const teamB = state.teams.find( (team) => team.id === match.teamBId);
                    
                    return (
                        <div key={match.id} className='flex flex-col border border-gray-300 justify-center capitalize items-center rounded-md bg-white py-10 gap-y-3 shadow-md cursor-pointer'>  
                         <span key={match.id} className='text-2xl text-center font-medium'>
                            {teamA?.teamName} 
                            <div>vs</div> 
                            {teamB?.teamName}</span>
                             {/* <span className='text-md '>Winner : CSK</span> */}

                        <span className='text-sm  hover:text-blue-900 hover:font-semibold' onClick={ 
                            () => {
                                dispatch({
                                    type: 'SET_CURRENT_MATCH',
                                    payload: match.id
                                });

                                navigate('/matches/live_match');
                            }
                        }>View Details</span>
                         </div>
                      )
                       
                        })
               }
   
           </div>
       </div>
  )
}

export default MatchContent