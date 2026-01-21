import React, { useContext, useEffect, useState } from 'react'
import defaultImage from "../assests/image.png"
import { category } from '../data/data'
import { MdArrowBackIosNew } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const AddTeam = () => {

 const {state , dispatch} = useContext(AppContext);
 const [teamName , setTeamName] = useState("");
 const [value , setValue] = useState(1);
 const navigate = useNavigate();
 
 function submitHandler(e)
 {
    e.preventDefault();

    dispatch(
      {
        type: 'ADD_TEAM',
        payload: {
          teamName: teamName,
          totalPlayers: value
        }
      }
    );

    setTeamName("");
    setValue(1);

 }

 
  return (
    <div className='h-screen w-full'>
        <div className=' bg-[#f9fafb] h-full flex justify-center py-2'>
            
            <form className='border border-black flex flex-col items-center pt-10 w-1/2 gap-y-10
            bg-white relative'
            onSubmit={submitHandler}>

               <h1 className='text-2xl'>Add New Team</h1>

              <div className='left-5 top-5 absolute cursor-pointer' 
                              onClick={()=> {navigate(-1) || navigate('/teams')}}>
                               <MdArrowBackIosNew/>
              </div>

              <div className= ' w-32 h-32 rounded-full'>
                <img src={defaultImage} alt='profile'  className='rounded-full '/>
              </div>

              <div className='flex gap-5'>
                <label>Team Name</label>
                 <input 
                 placeholder='Enter Player Name'
                 name='teamName'
                 value={teamName}
                 onChange={(e)=> setTeamName(e.target.value)}                
                 className='border border-b-black border-white p-1'
                 />
              </div>

              <div className='flex gap-5'>
                 <label>Total Players</label>
                  <input
                    type="number"
                    min={1}
                    max={14}
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                     className='border border-black rounded-lg p-1 w-12'
                  />
              </div>

          <button className='bg-[#142d4c] py-2 px-4 border border-black rounded-xl text-white'>Create Team</button>   

            </form>

           
        </div>
    </div>
  )
}

export default AddTeam