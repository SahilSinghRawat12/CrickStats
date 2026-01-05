import React from 'react'

const DashContent = () => {
  return (
    <div className='flex flex-col gap-y-10 ml-10   w-[65%] '>
       <div>
          <h1 className='text-2xl font-semibold'>Dashboard</h1>
       </div>

       <div className='flex items-center gap-x-14 '>
          <div className=' px-12 py-6 rounded-lg bg-blue-400 text-white shadow-md'>
             <p>1200</p>
             <p>Total runs</p>
          </div>
      
        <div className='rounded-lg bg-white shadow-md flex gap-x-10 px-12 py-6'>
          <div>
             <p>75</p>
             <p>Matches</p>
          </div>

          <div>
             <p>53.79</p>
             <p>Average</p>
          </div>

          <div>
             <p>54.08</p>
             <p>Strike Rate</p>
          </div>
        </div>

       </div>

   <div>
        <div className='py-8'>
           <h1 className='text-2xl font-bold'>Recent Matches</h1>
        </div>

        <div className='flex flex-col bg-white shadow-md   '>
            <div className='flex gap-5 justify-around items-center p-5 px-5 border border-gray-200'>
               <div className='w-full text-lg font-semibold'>Match</div>
               <div className='w-full text-lg font-semibold'>Score</div>
               <div className='w-full text-lg font-semibold'>Winner</div>
            </div>

            <div className='w-full'>
                <div className='flex gap-5 justify-around items-center border border-gray-200 py-5 px-5'>
                    <div className=' w-full'>Delhi Warriors</div>
                    <div className=' w-full'>230/8</div>
                    <div className=' w-full'>Delhi Warriors</div>
                </div>

                <div className='flex gap-5 justify-around items-center border border-gray-200 py-5 px-5'>
                     <div className=' w-full'>Bangalore Tigers</div>
                     <div className=' w-full'>215/10</div>
                     <div className=' w-full'>Chennai Lions</div>
                </div>
            </div>
        </div>
   </div>
    </div>
  )
}

export default DashContent