import React from 'react'
import { CiSquarePlus } from 'react-icons/ci'
import { playersList } from '../../data/data'
import { IoIosRemoveCircleOutline } from "react-icons/io";
import { NavLink, useNavigate } from 'react-router-dom';
import { MdArrowBackIosNew } from 'react-icons/md';

 

const TeamDetails = () => {

  const navigate = useNavigate();

  return (
    <div className='w-full relative pl-16'>
      <div className='left-5 top-5 absolute cursor-pointer' 
                      onClick={()=> {navigate(-1) || navigate('/teams')} }>
                       <MdArrowBackIosNew/>
                      </div>
          <div className='flex items-center w-[80%] mt-10 justify-between'>
                <h1 className='text-3xl font-bold'>Delhi Warriors</h1>
             
              
                  <button className='flex cursor-pointer  bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md items-center gap-x-2'
                   onClick={()=> navigate('/teams/teamdetails/add_player')} >
                         <CiSquarePlus color='white' size={23} />
                         <span>ADD Player</span>
                  </button>
              
           </div>


           <div className='w-[80%] mt-12'>
                   <h1 className='text-2xl mb-6'>Players</h1>

                     <div className='ml-5 '>
                          <div className='border border-gray-300 p-5 flex justify-between   items-center  '>
                              <div className='w-1/2'>
                                <span className=' text-lg'>Player</span>
                              </div>

                             <div className='flex  justify-center items-center w-1/2 text-lg'> 
                              <span className='w-full text-center'>Role</span>
                             </div>
                          </div>

                          {
                            playersList.map( (players , index) => (
                              <div key={index} className='border border-gray-300 p-4 flex justify-between  items-center  '>

                                  <div className='w-1/2'>
                                      <span>{players.player}</span>
                                  </div>

                                  <div className='flex justify-center items-center w-1/2'>
                                    <span className='w-full text-center'>{players.role}</span> 
                                  </div>

                                  <span>
                                      <IoIosRemoveCircleOutline size={18} className='cursor-pointer'/>
                                  </span>

                              </div>
                            ))
                          }
                        
                      </div>
                </div>

    </div>
  )
}

export default TeamDetails