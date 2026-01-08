import React, { useState } from 'react'
import defaultImage from "../assests/image.png"
import { category } from '../data/data'

const AddTeam = () => {

 const [teamName , setTeamName] = useState("");
 const [value , setValue] = useState(1);
 
 function submitHandler(e)
 {
    e.preventDefault();
 }

  return (
    <div className='h-screen w-full'>
        <div className=' bg-[#f9fafb] h-full flex justify-center py-2'>
            <form className='border border-black flex flex-col items-center pt-14 w-1/2 gap-y-10
            bg-white'
            onSubmit={submitHandler}>

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

              <button className='bg-[#142d4c] py-2 px-4 border border-black rounded-xl text-white'>Save</button>   

            </form>

           
        </div>
    </div>
  )
}

export default AddTeam