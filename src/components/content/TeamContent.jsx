import React, { useContext, useEffect, useState } from 'react'
import { CiSquarePlus } from "react-icons/ci";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { NavLink, useNavigate } from 'react-router-dom';
import defaultImage from "../../assests/image.png"
import { teamsNames } from '../../data/data.js';
import { AppContext } from '../../context/AppContext.jsx';
import { supabase } from '../../lib/supabaseCleint.js';
import { uploadImage } from '../../utils/uploadImage.js';
import toast from 'react-hot-toast';




const TeamContent = () => {

  const {state , dispatch} = useContext(AppContext);
  const navigate = useNavigate();

  const [avatars, setAvatars] = useState({});
  const [selectedTeam, setSelectedTeam] = useState(null);

  const fetchTeams = async ()=>{

    const {data: userData} = await supabase.auth.getUser();
     
    const {data , error} = await supabase
        .from("teams")
        .select(`
          id,
          team_name,
          image_url,  
          players(count)
         `)
         .eq("user_id" , userData.user.id)
         .order("created_at" , {ascending: true});


        if(error)
        {
          console.log(error);
          return;
        }

        dispatch({
          type:"SET_TEAMS",
          payload: data
        });
  };

  // const fetchPlayers = async () => {
  //   const {data , error} = await supabase
  //   .from("players")
  //   .select("*")

  //   if(error)
  //   {
  //     console.log(error);
  //     return;
  //   }

  //   dispatch({
  //     type: "SET_PLAYERS",
  //     payload: data
  //   })
  // }

  const deleteTeam = async (teamId) => {
    const {data: userData} = await supabase.auth.getUser();

      const {error} = await supabase
      .from("teams")
      .delete()
      .eq("id" , teamId)
      .eq("user_id" , userData.user.id);

      if(error)
      {
        console.log(error);
        return;        
      }

      dispatch(
        {
          type: "DELETE_TEAM",
          payload: teamId
        }
      );
  };

  const handleTeamAvatarChange = async (teamId, e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // preview
  const reader = new FileReader();
  reader.onload = (ev) => {
    setAvatars(prev => ({
      ...prev,
      [teamId]: ev.target.result
    }));
  };
  reader.readAsDataURL(file);

  // upload
  const imageUrl = await uploadImage(file, "teams");

  if (!imageUrl) {
    toast.error("Upload failed");
    return;
  }

  // update DB
  const { data , error } = await supabase
    .from("teams")
    .update({ image_url: imageUrl })
    .eq("id", teamId)
    .select()
    .maybeSingle();

  if (error) {
    console.log(error);
    toast.error("Failed to update image");
    return;
  }

  // update state
  dispatch({
    type: "SET_TEAMS",
    payload: state.teams.map(t =>
      t.id === teamId
        ? {...t , image_url: imageUrl}
        : t
    )
  });
};

  useEffect(()=>{
    fetchTeams();
    // fetchPlayers();
  }, [])
 
  return (
    <div className='w-full pl-16 '>
        <div className='flex items-center w-[80%] mt-10 justify-between'>
            <h1 className='text-3xl font-bold'>Teams</h1>

             
            <button className='flex cursor-pointer  bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md items-center gap-x-2'
            onClick={()=> navigate('/teams/addteam')}>
                <CiSquarePlus color='white' size={23} />
                 <span>ADD TEAM</span>
            </button>
          
        </div>

        <div className='mt-12 flex flex-col w-[80%]   gap-y-5 '>
 
          {
                state.teams.length === 0 ? (

          // 🔥 EMPTY STATE
          <div className="col-span-3 flex flex-col items-center justify-center py-20 gap-4 text-gray-500">

            <h2 className="text-xl font-semibold">No Teams Created</h2>

            <button
              onClick={() => navigate('/teams/add_team')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md"
            >
              ➕ Create Your First Team
            </button>

            </div>
             ) :

            (state.teams.map( (team)=> {

              // const totalPlayers = state.players.filter(
              //   player => player.team_id == team.id
              // ).length;
              
              const totalPlayers = team?.players?.[0]?.count || 0;

              return(
                 
            <div key={team.id} className='flex justify-between cursor-pointer bg-white border border-b-gray-300 shadow-sm rounded-md items-center px-5 py-2'>
             
             <div className='flex gap-5' >
                    <label className="relative w-20 h-20 rounded-full overflow-hidden cursor-pointer group">

                      <img
                        src={avatars[team.id] || team.image_url || defaultImage}
                        className="w-full h-full object-cover"
                      />

                      {/* overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs">
                        {team.image_url ? "Edit" : "Add"}
                      </div>

                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleTeamAvatarChange(team.id, e)}
                      />
                    </label>

                <div>
                   <h2 className='text-md font-semibold capitalize cursor-pointer hover:underline'
                   onClick={()=> setSelectedTeam(team)}>
                    {team.team_name}</h2>
                   <span className='text-sm text-gray-800'>{totalPlayers} Players</span>
                </div>

                <button
                onClick={() => deleteTeam(team.id)}
                className="bg-red-500 text-white px-3 py-1 h-8 mt-1 rounded ml-14"
              >
                Delete
              </button>
             </div>

                <div onClick={()=> {
              dispatch({type:'SET_CURRENT_TEAM' , payload:team.id})
              navigate(`/teams/${team.id}`)}}>
                    <MdOutlineKeyboardArrowRight size={30 }/>
                </div>
            </div>
              )   
          }))  
          }

        </div>
        
        
  {selectedTeam && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

    <div className="bg-white p-5 rounded-xl relative">

      <button
        onClick={() => setSelectedTeam(null)}
        className="absolute top-1 right-2 font-extrabold text-black"
      >
        ✕
      </button>

      <img
        src={selectedTeam.image_url || defaultImage}
        className="w-64 h-64 object-cover rounded-lg"
      />

      <p className="text-center mt-3 font-semibold">
        {selectedTeam.team_name}
      </p>

    </div>

  </div>
    )}
    </div>
  )
}

export default TeamContent