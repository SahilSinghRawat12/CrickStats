import React, { useContext , useEffect } from 'react'
import { CiSquarePlus } from 'react-icons/ci'
import { playersList } from '../../data/data'
import { IoIosRemoveCircleOutline } from "react-icons/io";
import { NavLink, useNavigate } from 'react-router-dom';
import { MdArrowBackIosNew } from 'react-icons/md';
import { AppContext } from '../../context/AppContext';
import { useParams } from 'react-router-dom';

 

const TeamDetails = () => {

  const {teamId} = useParams();
  
  const {state , dispatch} = useContext(AppContext);

  const navigate = useNavigate();

  const currentTeam = state.teams.find(
    (team) => team.id === teamId
  );

  const teamPlayers = state.players.filter(
    player => player.team_id === state.currentTeamId
  );

  useEffect(() => {

  dispatch({
    type: "SET_CURRENT_TEAM",
    payload: teamId
  });

}, [teamId]);
  
  return (
    <div className='w-full relative pl-16'>
      <div className='left-5 top-5 absolute cursor-pointer' 
                      onClick={()=> {navigate(-1) || navigate('/teams')} }>
                       <MdArrowBackIosNew/>
                      </div>
          <div className='flex items-center w-[80%] mt-10 justify-between'>
                <h1 className='text-3xl font-bold capitalize'>{currentTeam ? currentTeam.team_name : "No Team Selected"}</h1>
             
              
                  <button className='flex cursor-pointer  bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md items-center gap-x-2'
                   onClick={()=> navigate(`/teams/${state.currentTeamId}/add_player`)} >
                         <CiSquarePlus color='white' size={23} />
                         <span>ADD Player</span>
                  </button>
              
           </div>


           <div className='w-[80%] mt-12'>
                   <h1 className='text-2xl mb-6'>Players</h1>

                     <div className='ml-5 '>
                          <div className="border border-gray-300 p-5 grid grid-cols-[2fr_2fr_40px_40px] items-center">
                            <span className="text-lg font-bold">Player</span>
                            <span className="text-lg text-center font-bold">Role</span>
                            <span></span>
                            <span></span>
                          </div>

                          
                          {teamPlayers.map((player) => (
                                <div
                                  key={player.id}
                                  className="border border-gray-300 p-4 grid grid-cols-[2fr_2fr_40px_40px] items-center"
                                >
                                  {/* Player name */}
                                  <span className='capitalize'>{player.player_name}</span>

                                  {/* Role */}
                                  <span className="text-center">{player.player_role}</span>

                                  {/* Captain column (fixed space) */}
                                  <span className={`text-center font-bold ${player.is_Captain ? "visible" : "invisible"}`}>
                                    C
                                  </span>

                                  {/* Remove */}
                                  <span onClick={() => {
                                    dispatch({
                                      type: 'REMOVE_PLAYER',
                                      payload: player.id
                                      });
                                  }}>
                                  <IoIosRemoveCircleOutline  size={18} className="cursor-pointer mx-auto" />
                                  </span>
                                
                                </div>
                              ))}

                      </div>
                </div>

    </div>
  )
}

export default TeamDetails