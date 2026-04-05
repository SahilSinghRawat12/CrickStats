import React, { useContext, useEffect, useState } from 'react'
import defaultImage from "../assests/image.png"
import { category } from '../data/data'
import { MdArrowBackIosNew } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { supabase } from '../lib/supabaseCleint'
import toast from 'react-hot-toast'
import {uploadImage} from "../utils/uploadImage.js"




const AddTeam = () => {

 const {state , dispatch} = useContext(AppContext);
 const [teamName , setTeamName] = useState("");
 const [image, setImage] = useState(null);
 const [preview, setPreview] = useState(null);
//  const [value , setValue] = useState(1);
 const navigate = useNavigate();
 
 async function submitHandler(e)
 {
    e.preventDefault();

    let imageUrl = null;

    if(image)
    {
      imageUrl = await uploadImage(image , "teams");

      if(!imageUrl)
      {
        toast.error("Upload Failed");
        return;
      }
    }

    const {data: userData} = await supabase.auth.getUser();

    const {data , error} = await supabase
          .from("teams")
          .insert([{ 
            team_name: teamName,
            image_url: imageUrl,
            user_id: userData.user.id
          }])
          .select()
          .single();
          
          if(error)
          {
            console.log(error);
            return;
          }

    dispatch(
      {
        type: 'ADD_TEAM',
        payload:data
          // totalPlayers: value
      }
    );

    toast.success("Team Created");

    setTeamName("");
    // setValue(1);

 };

 const handleImageChange = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setImage(file);

  const reader = new FileReader();
  reader.onload = (ev) => setPreview(ev.target.result);
  reader.readAsDataURL(file);
};

 
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

              <label className="w-32 h-32 rounded-full overflow-hidden border-2 cursor-pointer flex items-center justify-center">

                <img
                  src={preview || defaultImage}
                  className="w-full h-full object-cover rounded-full"
                />

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"  
                  onChange={handleImageChange}
                />
              </label>

              <div className='flex gap-5'>
                <label>Team Name</label>
                 <input 
                 placeholder='Enter Team Name'
                 name='teamName'
                 value={teamName}
                 onChange={(e)=> setTeamName(e.target.value)}                
                 className='border border-b-black border-white p-1'
                 required
                 />
              </div>

              {/* <div className='flex gap-5'>
                 <label>Total Players</label>
                  <input
                    type="number"
                    min={1}
                    max={14}
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                     className='border border-black rounded-lg p-1 w-12'
                  />
              </div> */}

          <button className='bg-[#142d4c] py-2 px-4 border border-black rounded-xl text-white'>Create Team</button>   

            </form>

           
        </div>
    </div>
  )
}

export default AddTeam