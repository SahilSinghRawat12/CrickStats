import React from 'react'
import { CiSquarePlus } from 'react-icons/ci'

const PlayerContent = () => {
  return (
    <div className='w-full pl-16'>

        <div className='flex items-center w-[80%] mt-10 justify-between'>
            <h1 className='text-3xl font-bold'>Players</h1>
           
              <button className='flex cursor-pointer  bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md items-center gap-x-2'>
                           <CiSquarePlus color='white' size={23} />
                            <span>ADD Match</span>
               </button>
        </div>
           

        <div className='flex flex-col w-[80%] mt-10 bg-white border border-gray-300 rounded-md  '>
            <div className='flex justify-around items-center border border-b-gray-300 p-3'>
                <span className='w-full text-center font-semibold'>Name</span>
                <span className='w-full text-center font-semibold'>Runs</span>
                <span className='w-full text-center font-semibold'>Matches</span>
                <span className='w-full text-center font-semibold'>Fours</span>
                <span className='w-full text-center font-semibold'>Sixes</span>
                <span className='w-full text-center font-semibold'>Average</span>
            </div>

             <div className='flex justify-around items-center border border-b-gray-300 p-3'>
                <span className='w-full text-center'>john doe</span>
                <span className='w-full text-center'>1000</span>
                <span className='w-full text-center'>200</span>
                <span className='w-full text-center'>360</span>
                <span className='w-full text-center'>280</span>
                <span className='w-full text-center'>43.77</span>
            </div>

             <div className='flex justify-around items-center border border-b-gray-300 p-3'>
                <span className='w-full text-center'>john</span>
                <span className='w-full text-center'>1000</span>
                <span className='w-full text-center'>200</span>
                <span className='w-full text-center'>360</span>
                <span className='w-full text-center'>280</span>
                <span className='w-full text-center'>43.77</span>
            </div>
        </div>
    </div>
  )
}

export default PlayerContent