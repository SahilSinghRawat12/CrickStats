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

  const {data: userData} = await supabase.auth.getUser();

  const { error } = await supabase
    .from("matches")
    .delete()
    .eq("id", matchId)
    .eq("user_id" , userData.user.id);

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
  <div className='w-full px-4 sm:px-6 md:pl-16'>

    {/* HEADER */}
    <div className='flex flex-col sm:flex-row items-start sm:items-center w-full md:w-[80%] mt-24 lg:mt-10 justify-between gap-3 '>
      
      <h1 className='text-2xl md:text-3xl font-bold'>Matches</h1>

      <button 
        className='flex cursor-pointer bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md items-center gap-x-2 w-full sm:w-auto justify-center'
        onClick={()=> navigate('/matches/create_match')}
      >
        <CiSquarePlus color='white' size={23} />
        <span>ADD Match</span>
      </button>
    </div>

    {/* MATCHES */}
    <div className='mt-8 md:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full md:w-[80%] gap-4 md:gap-x-10'>

      {
        state.matches.length === 0 ? (

          // 🔥 EMPTY STATE
          <div className="col-span-full flex flex-col items-center justify-center py-16 gap-4 text-gray-500 text-center">

            <h2 className="text-lg md:text-xl font-semibold">No Matches Found</h2>

            <button
              onClick={() => navigate('/matches/create_match')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md"
            >
              ➕ Add Your First Match
            </button>

          </div>

        ) :

        ( state.matches.map( (match) =>  {
          
          const teamA = state.teams.find( (team) => team.id === match.team_a_id);
          const teamB = state.teams.find( (team) => team.id === match.team_b_id);
          
          return (
            <div 
              key={match.id} 
              className='flex flex-col border border-gray-300 justify-center capitalize items-center rounded-md bg-white py-6 md:py-10 px-3 gap-y-3 shadow-md cursor-pointer max-w-[320px] w-full mx-auto'
            >  

              <span className='text-lg md:text-2xl text-center font-medium'>
                {teamA?.team_name} 
                <div>vs</div> 
                {teamB?.team_name}
              </span>

              {/* <span className='text-md '>Winner : CSK</span> */}

              <span
                className={`px-3 py-1 rounded-full text-xs md:text-sm font-semibold ${
                  match.isfinished
                    ? "bg-red-100 text-red-600"
                    : "bg-green-100 text-green-600 animate-pulse"
                }`}
              >
                {match.isfinished ? "COMPLETED" : "LIVE"}
              </span>

              <span 
                className='text-sm hover:text-blue-900 hover:font-semibold text-center'
                onClick={ 
                  () => {
                    localStorage.setItem("currentMatchId", match.id);
                    dispatch({
                      type: 'SET_CURRENT_MATCH',
                      payload: match.id
                    });

                    navigate('/matches/live_match');
                  }
                }
              >
                View Details
              </span>

              <button
                onClick={() => deleteMatch(match.id)}
                className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>

            </div>
          )
        }))
      }

    </div>
  </div>
)
}

export default MatchContent