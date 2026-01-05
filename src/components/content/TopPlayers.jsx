import React from 'react'

const TopPlayers = () => {
  return (
    <div  className='  w-[35%] bg-[#ffffff] ml-5 mt-16 rounded-md'>
        
        <div className=' mt-5 ml-2'>
            <h1 className='text-2xl font-bold'>Top Players</h1>
            
            <div className='flex flex-col mx-2 mt-5 bg-white border border-gray-200 rounded-md shadow-sm   '>
                <div className='flex justify-around border border-b-gray-200 py-3 pl-6'>
                    <span className='w-full text-lg font-semibold'>Player</span>
                    <span className='w-full text-lg font-semibold'>Runs</span>
                </div>
                
                <div className='flex justify-around border border-b-gray-200 py-3 pl-6'>
                    <span className='w-full'>Virat Kohli</span>
                    <span className='w-full'>1200</span>
                </div>
            </div>
        </div>

    </div>
  )
}

export default TopPlayers