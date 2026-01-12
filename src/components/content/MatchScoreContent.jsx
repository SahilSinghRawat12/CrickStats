import React from 'react'
import { MdArrowBackIosNew } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

const MatchScoreContent = () => {
  const navigate = useNavigate();
  return (
    <div className='w-full   min-h-screen pl-16'>
        <div className='flex flex-col w-[80%] mt-10 justify-between relative'>
           
           <div className='left-2 top-0 absolute cursor-pointer' 
                           onClick={()=> {navigate(-1) || navigate('/matches')}}>
                            <MdArrowBackIosNew/>
            </div>
            
            <div className='flex justify-evenly items-center'>   
               <div className='flex flex-col items-center'>
                    <h1 className='text-2xl bg-blue-600 text-white
                    p-3 flex justify-center items-center rounded-full w-20 h-20'>MI</h1>
                    <span className='pt-5 flex justify-center items-center text-2xl font-semibold'>182/5</span>
                    <span className='flex justify-center items-center'>20 (20)</span>
               </div>
                 
                 <span className='text-2xl font-semibold'>VS</span>

               <div className='flex flex-col items-center'>
                   <h1 className='text-2xl bg-blue-600 text-white
                    p-3 flex justify-center items-center rounded-full w-20 h-20'>CSK</h1>
                   <span className='pt-5 flex justify-center items-center text-2xl font-semibold'>179/8</span>
                   <span className='flex justify-center items-center'>20 (20)</span>
               </div>
            </div>

            <div className='flex justify-center items-center mt-8 text-3xl font-semibold '>
                <h1>MI won by 3 runs</h1>
            </div>

            

              {/* batting scorecard */}
               
                <div className='w-full mt-12'>
                   <h1 className='text-2xl mb-6'>Batting</h1>

                     <div className='ml-5 '>
                          <div className='border border-gray-300 p-5 flex justify-between   items-center  '>
                              <div className='w-1/2'>
                                <span className=' text-lg'>Batsman</span>
                              </div>

                             <div className='flex  justify-center items-center w-1/2 text-lg'> 
                              <span className='w-full text-center'>R</span>
                              <span className='w-full text-center'>B</span>
                              <span className='w-full text-center'>SR</span>
                             </div>
                          </div>

                          <div className='border border-gray-300 p-4 flex justify-between  items-center  '>
                              <div className='w-1/2'>
                                <span>Rohit Sharma</span>
                              </div>

                             <div className='flex justify-center items-center w-1/2'>
                              <span className='w-full text-center'>72</span>
                              <span className='w-full text-center'>45</span>
                              <span className='w-full text-center'>160.0</span> 
                             </div> 
                              
                          </div>

                          <div className='border border-gray-300 p-4 flex justify-between  items-center  '>
                             <div className='w-1/2'>
                              <span>SuryaKumar Yadav</span>
                             </div>
                              
                              <div className='flex w-1/2 justify-center items-center'>
                                <span className='w-full text-center'>38</span>
                                <span className='w-full text-center'>26</span>
                                <span className='w-full text-center'>152.0</span>
                              </div>
                              
                          </div>
                      </div>
                </div>

                  {/* bowling scroecard */}
                   
                   <div className='w-full mt-16 mb-8 '>
                   <h1 className='text-2xl mb-6'>Bowling</h1>

                     <div className='ml-5 '>
                          <div className='border border-gray-300 p-5 flex justify-between   items-center  '>
                              <div className='w-1/2'>
                                <span className=' text-lg'>Bowler</span>
                              </div>

                             <div className='flex  justify-center items-center w-1/2 text-lg'> 
                              <span className='w-full text-center'>O</span>
                              <span className='w-full text-center'>R</span>
                              <span className='w-full text-center'>W</span>
                             </div>
                          </div>

                          <div className='border border-gray-300 p-4 flex justify-between  items-center  '>
                              <div className='w-1/2'>
                                <span>Jasprit Bumrah</span>
                              </div>

                             <div className='flex justify-center items-center w-1/2'>
                              <span className='w-full text-center'>4</span>
                              <span className='w-full text-center'>24</span>
                              <span className='w-full text-center'>3</span> 
                             </div> 
                              
                          </div>

                          <div className='border border-gray-300 p-4 flex justify-between  items-center  '>
                             <div className='w-1/2'>
                              <span>Trent Boult</span>
                             </div>
                              
                              <div className='flex w-1/2 justify-center items-center'>
                                <span className='w-full text-center'>4</span>
                                <span className='w-full text-center'>26</span>
                                <span className='w-full text-center'>2</span>
                              </div>
                              
                          </div>
                      </div>
                </div>

            
            </div>   
         </div>
    
  )
}

export default MatchScoreContent