import React, { useContext, useEffect, useState } from 'react'
import { MdArrowBackIosNew } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { teamsNames } from '../data/data'
import { AppContext } from '../context/AppContext'

const AddMatch = () => {

 const {state} = useContext(AppContext);
 const [teamName , setTeamName] = useState("");
 const [value , setValue] = useState(1);
 const navigate = useNavigate();

 const [teamA , setTeamA] = useState(null);
 const [teamB , setTeamB] = useState(null);
 
 function submitHandler(e)
 {
    e.preventDefault();

    //double check for safety
    if (teamA === teamB) {
    alert("Team A and Team B cannot be the same");
    return;
    }

 }

 

  return (
    <div className='h-screen w-full'>
        <div className=' bg-[#f9fafb] h-full flex justify-center py-2'>
           
            <form className='border border-black flex flex-col items-center pt-5 w-1/2 gap-y-8
            bg-white relative'
            onSubmit={submitHandler}>

             {/* for back arrow */}
              <div className='left-5 top-5 absolute cursor-pointer' 
                onClick={()=> {navigate(-1) || navigate('/matches')}}>
                <MdArrowBackIosNew/>
              </div>

                {/* for team selection */}
               <div className='flex gap-20 w-full px-20'>
                
                   <div className='flex flex-col gap-y-2'>
                    <label>Select Team A</label>
                    <select className="border border-black p-2 rounded "
                    value={teamA ?? ""}
                    onChange={(e) => setTeamA(Number(e.target.value))}
                    >
                        <option disabled hidden>Select Team</option>
                        {
                        state.teams.map((team) => (
                            <option key={team.id}
                            value={team.id}
                            disabled={team.id === teamB}>
                                {team.teamName}
                            </option>
                        ))
                        }
                    </select>
                   </div>

                  <div className='flex flex-col gap-y-2'>
                    <label>Select Team B</label>
                    <select className="border border-black p-2 rounded "
                    value={teamB ?? ""}
                    onChange={(e)=> setTeamB(Number(e.target.value))}>
                        <option disabled hidden>Select Team</option>
                        {
                        state.teams.map((team) => (
                            <option key={team.id}
                            value={team.id}
                            disabled={team.id === teamA}>
                                {team.teamName}
                            </option>
                        ))
                        }
                    </select>
                  </div>

                </div>

                    {/* for overs */}
                   <div className='flex flex-col w-[80%] px-20 py-5 gap-8 border border-gray-500
                   ' >
                     
                        <div className='flex flex-col items-center gap-2 '>
                        <h1 className='text-md font-bold'>Overs</h1>

                        <input 
                        type='text'
                        placeholder='Overs'
                        className='border border-black p-2 rounded  '/>
                        </div>


                        <div className='flex flex-col items-center gap-2 '>
                        <h1 className='text-md font-bold'>Match Date</h1>

                        <input 
                        type='date'
                        placeholder='Overs'
                        className='border border-black p-2 rounded  '/>
                        </div>

                    </div>
               
                   {/* for toss */}
                   <div className='flex flex-col w-[50%] border border-gray-500 py-3 rounded-md'>
                       
                        <div className='flex px-5  justify-between border-b border-b-gray-500  py-2'>
                            <div>Toss Winner</div>
                            <div>Chose To</div>
                        </div>

                        <div className='flex px-5 justify-between   py-2'>
                            <select>
                                <option>
                                    {teamA}
                                </option>
                                <option>
                                    {teamB}
                                </option>
                            </select>
                             <select className="border border-black rounded w-20 py-1 ">
                                <option>Bat</option>
                                <option>Bowl</option>
                             </select>
                        </div>
                   </div>

              <button className='bg-[#142d4c] py-2 px-4 border border-black rounded-xl text-white'
              onClick={()=> navigate('/live_match')}>
                Create Match
              </button>   

            </form>

           
        </div>
    </div>
  )
}

export default AddMatch