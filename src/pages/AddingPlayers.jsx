import React, { useContext, useEffect, useState } from 'react'
import defaultImage from "../assests/image.png"
import { category } from '../data/data'
import { MdArrowBackIosNew } from "react-icons/md";
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { supabase } from '../lib/supabaseCleint';
import toast from 'react-hot-toast';


const AddingPlayers = () => {

   const {state , dispatch} = useContext(AppContext);

    const {teamId} = useParams();
    const [isActiveIndex , setIsActiveIndex] = useState(null);
    const [name , setName] = useState("");
    const [role , setRole] = useState("");
    const [captain , setCaptain] = useState(false);

    const navigate = useNavigate();


    async function submitHandler(event)
    {
      event.preventDefault();

       // VALIDATION GOES HERE
        if (!role) {
          alert("Please select a player role");
          return;
        }       
        
        const {data: userData} = await supabase.auth.getUser();

          // if selecting captain → remove old captain
          if (captain) {
            await supabase
              .from("players")
              .update({ is_captain: false })
              .eq("team_id", teamId)
              .eq("user_id", userData.user.id);
          }

        const {data , error} = await supabase
        .from("players")
        .insert([
          {
            player_name: name,
            player_role: role,
            is_captain: captain,
            team_id: teamId,
            user_id: userData.user.id 
          }
        ])
        .select()   // selects the inserted row
        .single();  // selects only the object from the array

        if(error)
        {
          console.log(error);
          return;
        }

       dispatch({
         type:'ADD_PLAYER',
         payload: data
       });

       toast.success("Player Added");

       setName("");
       setRole("");
       setCaptain(false);
       setIsActiveIndex(null);
    }

     
        
    const fetchPlayers = async () => {

      const {data: userData} = await supabase.auth.getUser();

      const {data , error} = await supabase
      .from("players")
      .select("*")
      .eq("team_id" , teamId)
       .eq("user_id" , userData.user.id)
       .order("created_at" , { ascending: true });

      if(error)
      {
        console.log(error);
        return;
      }
      
      dispatch({
        type: "SET_PLAYERS",
        payload: data
      });

    };

    useEffect(()=>{
      fetchPlayers();
    } , [teamId]);

  return (
  <div className='h-screen w-full'>
    <div className='bg-[#f9fafb] h-full flex justify-center py-2 px-2 sm:px-4 md:px-6'>
      
      <form 
        className='border relative border-black flex flex-col items-center pt-10 w-full sm:w-[80%] md:w-[60%] lg:w-1/2 gap-y-10 bg-white'
        onSubmit={submitHandler}
      >

        <h1 className='text-xl sm:text-2xl'>Add New Player</h1>  

        <div 
          className='left-3 sm:left-5 top-4 sm:top-5 absolute cursor-pointer' 
          onClick={()=> {navigate(-1) || navigate('/teams/teamdetails')}}
        >
          <MdArrowBackIosNew/> 
        </div>

        {/* <div className= ' w-32 h-32 rounded-full'>
          <img src={defaultImage} alt='profile'  className='rounded-full '/>
        </div> */}

        {/* NAME */}
        <div className='flex flex-col sm:flex-row gap-3 sm:gap-5 pt-10 sm:pt-14  px-4 sm:px-0 items-start sm:items-center'>
          <label>Player Name</label>

          <input 
            placeholder='Enter Player Name'
            required
            className='border border-b-black border-white p-1 w-full sm:w-auto'
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* CATEGORY */}
        <div className='flex flex-wrap gap-3 sm:gap-6 px-2 py-2 justify-center'>
          {
            category.map((cat , index) => (
              <div 
                key={index}
                onClick={(e)=> { 
                  setIsActiveIndex(index)
                  setRole(cat.category)
                }}
                className={`border border-black py-2 px-4 rounded-xl cursor-pointer transition-colors duration-200 hover:bg-black hover:text-white
                ${isActiveIndex === index ? "bg-black text-white" : "bg-white text-black"}`}
              >
                {cat.category}
              </div>
            ))
          }
        </div> 

        {/* CAPTAIN */}
        <div className='px-2 py-2'>
          <div 
            onClick={() => setCaptain(prev => !prev)}
            className={`border border-black py-2 px-4 rounded-xl transition-colors cursor-pointer duration-200 hover:bg-blue-800 hover:text-white
            ${captain ? "bg-blue-800 text-white" : "bg-white text-black"}`}
          >
            Captain
          </div>
        </div>  

        {/* BUTTON */}
        <button className='bg-[#142d4c] py-2 px-4 border border-black rounded-xl text-white w-1/2 sm:w-auto'>
          Save
        </button>   

      </form>
    </div>
  </div>
)
}

export default AddingPlayers