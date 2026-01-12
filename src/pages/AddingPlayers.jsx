import React, { useState } from 'react'
import defaultImage from "../assests/image.png"
import { category } from '../data/data'
import { MdArrowBackIosNew } from "react-icons/md";
import { useNavigate } from 'react-router-dom';


const AddingPlayers = () => {

    const [isActiveIndex , setIsActiveIndex] = useState(0);
    const [isActive , setIsActive] = useState(false);
    const [name , setName] = useState("");
    const navigate = useNavigate();

    function submitHandler(event)
    {
      event.preventDefault();
    }

  return (
    <div className='h-screen w-full'>
        <div className=' bg-[#f9fafb] h-full flex justify-center py-2'>
            <form className='border relative border-black flex flex-col items-center pt-5 w-1/2 gap-y-10
            bg-white'
            onSubmit={submitHandler} >

              <h1 className='text-2xl'>Add New Player</h1>

                <div className='left-5 top-5 absolute cursor-pointer' 
                onClick={()=> {navigate(-1) || navigate('/teams/teamdetails')}}>
                 <MdArrowBackIosNew/>
                </div>

              <div className= ' w-32 h-32 rounded-full'>
                <img src={defaultImage} alt='profile'  className='rounded-full '/>
              </div>

              <div className='flex gap-5'>
                <label>Player Name</label>
                 <input 
                 placeholder='Enter Player Name'
                 className='border border-b-black border-white p-1'
                 name = "name"
                 value = {name}
                 onChange={(e)=> setName(e.target.value)}
                 />
              </div>

                  <div className='flex gap-8 px-2 py-2'>
                    {
                      category.map((cat , index) => (
                        <button key={index}
                         onClick={()=> setIsActiveIndex(index)}
                        className={`border border-black py-2 px-4 rounded-xl transition-colors duration-200 hover:bg-black hover:text-white
                        ${isActiveIndex === index ? "bg-black text-white" : "bg-white text-black"}`}>
                          {cat.category}
                        </button>
                      ))
                    }
                  </div> 

                  <div className='px-2 py-2'>
                     <button 
                      onClick={() => setIsActive(!isActive)}
                      className={`border border-black py-2 px-4 rounded-xl  transition-colors duration-200 hover:bg-blue-800 hover:text-white
                      ${isActive ? "bg-blue-800 text-white" : "bg-white text-black"}`}>
                      Captain
                      </button>
                  </div>  

                  <button className='bg-[#142d4c] py-2 px-4 border border-black rounded-xl text-white'>Save</button>   
            </form>

           
        </div>
    </div>
  )
}

export default AddingPlayers