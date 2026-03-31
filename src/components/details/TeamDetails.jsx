import React, { useContext, useEffect, useState } from 'react'
import { CiSquarePlus } from 'react-icons/ci'
import { IoIosRemoveCircleOutline } from "react-icons/io";
import { useNavigate, useParams } from 'react-router-dom';
import { MdArrowBackIosNew } from 'react-icons/md';
import { AppContext } from '../../context/AppContext';
import { supabase } from '../../lib/supabaseCleint';
import { uploadImage } from '../../utils/uploadImage';
import toast from 'react-hot-toast';



const TeamDetails = () => {

  const { teamId } = useParams();
  const { state, dispatch } = useContext(AppContext);
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState({});
  const [selectedPlayer , setSelectedPlayer] = useState(null);

  const currentTeam = state.teams.find((team) => team.id == teamId);
  const teamPlayers = state.players.filter(player => player.team_id == teamId);

  const fetchPlayers = async () => {
    const { data, error } = await supabase
      .from("players")
      .select("*")
      .eq("team_id", teamId)
      .order("created_at" , {ascending: true});

    if (error) { console.log(error); return; }
    
    dispatch({ type: "SET_PLAYERS", payload: data });
  };

  const fetchTeams = async () => {
    const { data, error } = await supabase.from("teams").select("*");
    if (error) { console.log(error); return; }
    dispatch({ type: "SET_TEAMS", payload: data });
  };

  const deletePlayer = async (playerId) => {
    const { error } = await supabase.from("players").delete().eq("id", playerId);
    if (error) { console.log(error); return; }
    dispatch({ type: "REMOVE_PLAYER", payload: playerId });
  };

 // handling images avatar
  const handleAvatarChange = async (playerId, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // preview 
    const reader = new FileReader();
    reader.onload = (ev) =>
       setAvatars(prev => ({
         ...prev, 
         [playerId]: ev.target.result
         }));
    reader.readAsDataURL(file);

    // upload to supabase
    const imageUrl = await uploadImage(file , "players");
    if(!imageUrl) {
      toast.error("Upload Failed");
      return;
    }

    //save in DB
    const {error} = await supabase
    .from("players")
    .update({image_url: imageUrl})
    .eq("id" , playerId);

    if(error)
    {
      console.log(error);
      toast.error("Failed to save the image");
      return;
    }

   dispatch({
  type: "SET_PLAYERS",
  payload: state.players.map(p =>
    p.id === playerId
      ? { ...p, image_url: imageUrl }
      : p
      )
    });
  };



  useEffect(() => {
    dispatch({ type: "SET_CURRENT_TEAM", payload: teamId });
    fetchTeams();
    fetchPlayers();
  }, [teamId]);

  return (
    <div className='min-h-screen bg-gray-50 w-full'>
      <div className='max-w-5xl mx-auto px-4 sm:px-6 py-8'>

        {/* Back Button */}
        <button
          onClick={() => {
            if(window.history.length > 1)
               navigate(-1) 
            else navigate('/teams')
            }}
          className='flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm font-medium mb-8 transition-colors'
        >
          <MdArrowBackIosNew size={13} />
          Back to Teams
        </button>

        {/* Header */}
        <div className='flex flex-wrap items-center justify-between gap-4 mb-8'>
          <div>
            <p className='text-xs text-gray-400 uppercase tracking-widest mb-1'>Team</p>
            <h1 className='text-2xl sm:text-3xl font-bold text-gray-800 capitalize'>
              {currentTeam ? currentTeam.team_name : "No Team Selected"}
            </h1>
          </div>

          <button
            onClick={() => navigate(`/teams/${state.currentTeamId}/add_player`)}
            className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold py-2.5 px-5 rounded-xl shadow-md shadow-blue-200 transition-all text-sm'
          >
            <CiSquarePlus size={20} />
            Add Player
          </button>
        </div>

        {/* Stats Row */}
        <div className='grid grid-cols-3 bg-white rounded-2xl border border-gray-100 shadow-sm mb-6 overflow-hidden'>
          <div className='flex flex-col items-center py-4 border-r border-gray-100'>
            <span className='text-2xl font-bold text-gray-800'>{teamPlayers.length}</span>
            <span className='text-xs text-gray-400 uppercase tracking-wider mt-1'>Players</span>
          </div>
          <div className='flex flex-col items-center py-4 border-r border-gray-100'>
            <span className='text-2xl font-bold text-gray-800'>{teamPlayers.filter(p => p.is_Captain).length}</span>
            <span className='text-xs text-gray-400 uppercase tracking-wider mt-1'>Captains</span>
          </div>
          <div className='flex flex-col items-center py-4'>
            <span className='text-2xl font-bold text-gray-800'>{Math.max(0, 11 - teamPlayers.length)}</span>
            <span className='text-xs text-gray-400 uppercase tracking-wider mt-1'>Slots Left</span>
          </div>
        </div>

        {/* Players Card */}
        <div className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>

          {/* Table Header */}
          <div className='grid grid-cols-[48px_1fr_100px_40px] sm:grid-cols-[56px_1fr_140px_44px] gap-3 items-center px-4 sm:px-6 py-3 bg-gray-50 border-b border-gray-100'>
            <span />
            <span className='text-xs font-semibold text-gray-400 uppercase tracking-wider'>Player</span>
            <span className='text-xs font-semibold text-gray-400 uppercase tracking-wider text-center'>Role</span>
            <span />
          </div>

          {/* Empty State */}
          {teamPlayers.length === 0 && (
            <div className='flex flex-col items-center justify-center py-16 text-gray-400'>
              <span className='text-4xl mb-3'>🏃</span>
              <p className='text-sm'>No players yet. Add your first player!</p>
            </div>
          )}

          {/* Player Rows */}
          {teamPlayers.map((player) => (
            <div
              key={player.id}
              className='grid grid-cols-[48px_1fr_100px_40px] sm:grid-cols-[56px_1fr_140px_44px] gap-3 items-center px-4 sm:px-6 py-3 border-b border-gray-50 last:border-b-0 hover:bg-gray-50 transition-colors'
            >
              {/* Avatar */}
             <label className='relative w-12 h-12 rounded-full overflow-hidden cursor-pointer group'>

                <img
                  src={avatars[player.id] || player.image_url || "../../../public/defaultAvatar.png"}
                  alt={player.player_name}
                  className='w-full h-full object-cover'
                />

                {/* overlay */}
                <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs'>
                  {player.image_url ? "Edit" : "Add"}
                </div>

                <input
                  type='file'
                  accept='image/*'
                  className='hidden'
                  onChange={(e) => handleAvatarChange(player.id, e)}
                />
              </label>

              {/* Name + Captain Badge */}
              <div className='flex items-center gap-2 min-w-0'>
                <span className='font-semibold text-gray-800 capitalize truncate text-sm sm:text-base cursor-pointer hover:underline'
                onClick={() => setSelectedPlayer(player)}>
                  {player.player_name}
                </span>
                {player.is_Captain && (
                  <span className='flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-red-400 text-white text-[10px] font-bold flex items-center justify-center shadow-sm'>
                    C
                  </span>
                )}
              </div>

              {/* Role */}
              <div className='flex justify-center'>
                <span className='inline-block bg-blue-50 text-blue-600 text-sm font-medium px-3 py-1 rounded-full'>
                  {player.player_role || '—'}
                </span>
              </div>

              {/* Delete */}
              <div className='flex justify-center'>
                <IoIosRemoveCircleOutline
                  size={20}
                  className='text-black hover:text-red-500 cursor-pointer transition-colors'
                  onClick={() => deletePlayer(player.id)}
                />
              </div>

            </div>
          ))}
        </div>

      </div>

      {selectedPlayer && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

    <div className="bg-white p-5 rounded-xl relative">

      <button
        onClick={() => setSelectedPlayer(null)}
        className="absolute top-1 right-2 text-black font-bold"
      >
        ✕
      </button>

      <img
        src={selectedPlayer.image_url || "../../../public/defaultAvatar.png"}
        className="w-60 h-60 object-cover rounded-lg"
      />

      <p className="text-center mt-3 font-semibold">
        {selectedPlayer.player_name}
      </p>

    </div>

  </div>
)}
      
    </div>

    

    
  );
};

export default TeamDetails;