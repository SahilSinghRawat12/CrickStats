import React, { useContext, useEffect, useState } from 'react'
import { CiSquarePlus } from "react-icons/ci";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { supabase } from '../../lib/supabaseCleint';
import { FetchContext } from '../../context/FetchContext';
import toast from 'react-hot-toast';




const MatchContent = () => {

    const {getMatches , getTeams} = useContext(FetchContext);
    const {state , dispatch} = useContext(AppContext);
    const navigate = useNavigate();
    
    
useEffect(()=>{
  
    const loadData = async ()=>{
        
        const teams = await getTeams();
        const matches = await getMatches();
   
         dispatch({
        type: "SET_TEAMS",
        payload: teams
        });

        dispatch({
         type: "SET_MATCHES",
         payload: matches
       });
    };
    
    loadData();
},[])


const deleteMatch = async (matchId) => {
  const { error } = await supabase
    .from("matches")
    .delete()
    .eq("id", matchId);

  if (error) {
    console.log(error);
    toast.error("Failed to delete match");
    return;
  }

  toast.success("Match deleted");

  const matches = await getMatches();
  dispatch({ type: "SET_MATCHES", payload: matches });
};
 

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
                    
                    const teamA = state.teams.find( (team) => team.id === match.team_a_id);
                    const teamB = state.teams.find( (team) => team.id === match.team_b_id);
                    
                    return (
                        <div key={match.id} className='flex flex-col border border-gray-300 justify-center capitalize items-center rounded-md bg-white py-10 gap-y-3 shadow-md cursor-pointer'>  
                         <span key={match.id} className='text-2xl text-center font-medium'>
                            {teamA?.team_name} 
                            <div>vs</div> 
                            {teamB?.team_name}</span>
                             {/* <span className='text-md '>Winner : CSK</span> */}
                        
                        <span className="text-blue-800 font-bold text-xl">{match.status}</span>

                        <span className='text-sm  hover:text-blue-900 hover:font-semibold' onClick={ 
                            () => {
                                localStorage.setItem("currentMatchId", match.id);
                                dispatch({
                                    type: 'SET_CURRENT_MATCH',
                                    payload: match.id
                                });

                                navigate('/matches/live_match');
                            }
                        }>View Details</span>
                        
                        <button
                        onClick={() => deleteMatch(match.id)}
                        className="mt-2 px-3 py-1 bg-red-500 text-white rounded
                         hover:bg-red-600 " >
                        Delete
                        </button>
                         </div>
                      )
                       
                        })
               }
               
           </div>
           
       </div>
  )
}

export default MatchContent