import React, { useContext, useEffect, useState } from 'react'
import { MdArrowBackIosNew } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { teamsNames } from '../data/data'
import { AppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { supabase } from "../lib/supabaseCleint"
import { FetchContext } from '../context/FetchContext'


const AddMatch = () => {

  const {getTeams , getPlayers} = useContext(FetchContext);

 const {state , dispatch} = useContext(AppContext);
 const [teamName , setTeamName] = useState("");
 const [value , setValue] = useState(1);
 const navigate = useNavigate();

 const [teamA , setTeamA] = useState("");
 const [teamB , setTeamB] = useState("");

 const [formData , setFormData] = useState({
    overs : "" , 
    date : "",
    tossWinner: null,
    tossDecision: ""

 })

 // fetches the data when page loads
 useEffect(() => {

  //fetching teams
  const loadTeams = async () => {
    const teams = await getTeams();

      dispatch({
      type: "SET_TEAMS",
      payload: teams
    });
  };

  //fetching players
  const loadPlayers = async () => {
    const players = await getPlayers();

       dispatch({
      type: "SET_PLAYERS",
      payload: players
    });
  };

    loadTeams();
    loadPlayers();

}, []);
 

// submit handler -> sends the data to the database and reducer
 async function submitHandler(e)
 {
    e.preventDefault();

    
     const teamAPLayers =  state.players.filter(
      player => String(player.team_id) == String(teamA)
     );

     if(teamAPLayers.length === 0)
     {
      toast.error("Team A must have atleast 1 player");
      return;
     }

     const teamBPLayers =  state.players.filter(
      player => String(player.team_id) == String(teamB)
     );

     if(teamBPLayers.length === 0)
     {
      toast.error("Team B must have atleast 1 player");
      return;
     }

   const {data , error} = await supabase
   .from("matches")
   .insert([
    {
        team_a_id: teamA,
        team_b_id: teamB,
        overs: formData.overs,
        match_date: formData.date,
        toss_winner_id: formData.tossWinner,
        toss_decision: formData.tossDecision,
        status: "live" 
    }
   ])
   .select()
   .single();

   if(error)
   {
    console.log(error);
    toast.error("Failed to create match");
    return;
   }

   dispatch({
    type: "CREATE_MATCH",
    payload:data
   });


    navigate('/matches');

 }

 // change handler function -> handles the inputs
 function changeHandler(e)
 {
     const {name , value} = e.target;

     setFormData((prev) => ({
        ...prev,
        [name]: value
     }));
 }


  return (
    <div className='h-screen w-full'>
        <div className=' bg-[#f9fafb] h-full flex justify-center py-2'>
           
            <form className='border border-black flex flex-col items-center pt-5 w-1/2 gap-y-8
            bg-white relative'
            onSubmit={submitHandler}>

             {/* for back arrow */}
              <div className='left-5 top-5 absolute cursor-pointer' 
                onClick={()=> {navigate(-1) || navigate('/matches')}}>
                <MdArrowBackIosNew/>
              </div>

                {/* for team selection */}
               <div className='flex gap-20 w-full px-20'>
                
                   <div className='flex flex-col gap-y-2'>
                    <label>Select Team A</label>
                   <select
                        required
                        value={teamA ?? ""}
                        onChange={(e) => setTeamA(e.target.value)}
                        className="border border-black p-2 rounded"
                        >

                        <option value="" disabled hidden>Select Team</option>

                        {state.teams.map(team => (
                        <option
                        key={team.id}
                        value={team.id}
                        disabled={team.id.toString() === teamB}
                        className='capitalize'
                        >
                        {team.team_name}
                        </option>
                        ))}
                    </select>
                   </div>

                  <div className='flex flex-col gap-y-2'>
                    <label>Select Team B</label>
                    <select className="border border-black p-2 rounded "
                    required
                    value={teamB ?? ""}
                    onChange={(e) => setTeamB(e.target.value)}
                    >

                    <option value="" disabled hidden>Select Team</option>

                    {state.teams.map(team => (
                    <option
                    key={team.id}
                    value={team.id}
                    disabled={team.id.toString() === teamA}
                    className='capitalize'
                    >
                    {team.team_name}
                    </option>
                    ))}
                    </select>
                  </div>

                </div>

                    {/* for overs */}
                   <div className='flex flex-col w-[80%] px-20 py-5 gap-8 border border-gray-500
                   ' >
                     
                        <div className='flex flex-col items-center gap-2 '>
                        <h1 className='text-md font-bold'>Overs</h1>

                        <input 
                        required
                        type='number'
                        min={1}
                        name='overs'
                        value={formData.overs}
                        placeholder='Overs'
                        onChange={changeHandler}
                        className='border border-black p-2 rounded  '/>
                        </div>


                        <div className='flex flex-col items-center gap-2 '>
                        <h1 className='text-md font-bold'>Match Date</h1>

                        <input 
                        required
                        type='date'
                        name='date'
                        value={formData.date}
                        onChange={changeHandler}
                        className='border border-black p-2 rounded  '/>
                        </div>

                    </div>
               
                   {/* for toss */}
                  { teamA && teamB && (
                <div className='flex flex-col w-[50%] border border-gray-500 py-3 rounded-md'>

                  <div className='flex px-5 justify-between border-b border-b-gray-500 py-2'>
                    <div>Toss Winner</div>
                    <div>Chose To</div>
                  </div>

                  <div className='flex px-5 justify-between py-2'>

                    <select
                      required
                      name="tossWinner"
                      value={formData.tossWinner || ""}
                      onChange={changeHandler}
                      className="border border-black rounded px-2 py-1"
                    >
                      <option value="" disabled hidden >Select Team</option>

                      <option value={teamA} className='capitalize'>
                        {state.teams.find(t => t.id.toString() === teamA)?.team_name}
                      </option>

                      <option value={teamB} className='capitalize'>
                        {state.teams.find(t => t.id.toString() === teamB)?.team_name}
                      </option>

                    </select>

                    <select
                      className="border border-black rounded w-20 py-1"
                      required
                      name="tossDecision"
                      value={formData.tossDecision}
                      onChange={changeHandler}
                    >
                      <option value="" hidden>Select</option>
                      <option value="bat">Bat</option>
                      <option value="bowl">Bowl</option>
                    </select>

                  </div>

                </div>
                )}

              <button className='bg-[#142d4c] py-2 px-4 border border-black rounded-xl text-white'>
                Create Match
              </button>   

            </form>

           
        </div>
    </div>
  )
}

export default AddMatch








/////////////////////////////////


// import React, { useContext, useEffect, useState } from 'react'
// import { MdArrowBackIosNew } from 'react-icons/md'
// import { useNavigate } from 'react-router-dom'
// import { teamsNames } from '../data/data'
// import { AppContext } from '../context/AppContext'
// import toast from 'react-hot-toast'
// import { supabase } from "../lib/supabaseCleint"


// const AddMatch = () => {

//  const {state , dispatch} = useContext(AppContext);
//  const [teamName , setTeamName] = useState("");
//  const [value , setValue] = useState(1);
//  const navigate = useNavigate();

//  const [teamA , setTeamA] = useState(null);
//  const [teamB , setTeamB] = useState(null);

//  const [formData , setFormData] = useState({
//     overs : "" , 
//     date : "",
//     tossWinner: null,
//     tossDecision: ""

//  })
 
//  async function submitHandler(e)
//  {
//     e.preventDefault();

//     if(state.players.filter(
//         player => player.team_id == teamA
//     ).length < 1)
//     {
//         toast.error("There should be atleast 1 or more players on teamA")
//         return;
//     }

//     if(state.players.filter(
//         player => player.team_id == teamB
//     ).length < 1)
//     {
//         toast.error("There should be atleast 1 or more players on teamB")
//         return;
//     }

//     //double check for safety
//     if (teamA === teamB) {
//     toast.error("Team A and Team B cannot be the same");
//     return;
//     }

//    const {data , error} = await supabase
//    .from("matches")
//    .insert([
//     {
//         team_a_id: teamA,
//         team_b_id: teamB,
//         overs: formData.overs,
//         date: formData.date,
//         toss_winner_id: Number(formData.tossWinner),
//         toss_decision: formData.tossDecision,
//         status: "live" 
//     }
//    ])
//    .select()
//    .single();

//    if(error)
//    {
//     console.log(error);
//     toast.error("Failed to create match");
//     return;
//    }

//    dispatch({
//     type: "CREATE_MATCH",
//     payload:data
//    });


//     navigate('/matches');

//  }

//  function changeHandler(e)
//  {
//      const {name , value} = e.target;

//      setFormData((prev) => ({
//         ...prev,
//         [name]: value
//      }));
//  }


//   return (
//     <div className='h-screen w-full'>
//         <div className=' bg-[#f9fafb] h-full flex justify-center py-2'>
           
//             <form className='border border-black flex flex-col items-center pt-5 w-1/2 gap-y-8
//             bg-white relative'
//             onSubmit={submitHandler}>

//              {/* for back arrow */}
//               <div className='left-5 top-5 absolute cursor-pointer' 
//                 onClick={()=> {navigate(-1) || navigate('/matches')}}>
//                 <MdArrowBackIosNew/>
//               </div>

//                 {/* for team selection */}
//                <div className='flex gap-20 w-full px-20'>
                
//                    <div className='flex flex-col gap-y-2'>
//                     <label>Select Team A</label>
//                     <select className="border border-black p-2 rounded "
//                     required
//                     value={teamA ?? ""}
//                     onChange={(e) => setTeamA(Number(e.target.value))}
//                     >
//                         <option value="" disabled hidden>Select Team</option>
//                         {
//                         state.teams.map((team) => (
//                             <option key={team.id}
//                             value={team.id}
//                             disabled={team.id === teamB}>
//                                 {team.team_name}
//                             </option>
//                         ))
//                         }
//                     </select>
//                    </div>

//                   <div className='flex flex-col gap-y-2'>
//                     <label>Select Team B</label>
//                     <select className="border border-black p-2 rounded "
//                     required
//                     value={teamB ?? ""}
//                     onChange={(e)=> setTeamB(Number(e.target.value))}>
                       
//                         <option value="" disabled hidden>Select Team</option>
//                         {
//                         state.teams.map((team) => (
//                             <option key={team.id}
//                             value={team.id}
//                             disabled={team.id === teamA}>
//                                 {team.team_name}
//                             </option>
//                         ))
//                         }
//                     </select>
//                   </div>

//                 </div>

//                     {/* for overs */}
//                    <div className='flex flex-col w-[80%] px-20 py-5 gap-8 border border-gray-500
//                    ' >
                     
//                         <div className='flex flex-col items-center gap-2 '>
//                         <h1 className='text-md font-bold'>Overs</h1>

//                         <input 
//                         required
//                         type='number'
//                         min={1}
//                         name='overs'
//                         value={formData.overs}
//                         placeholder='Overs'
//                         onChange={changeHandler}
//                         className='border border-black p-2 rounded  '/>
//                         </div>


//                         <div className='flex flex-col items-center gap-2 '>
//                         <h1 className='text-md font-bold'>Match Date</h1>

//                         <input 
//                         required
//                         type='date'
//                         name='date'
//                         value={formData.date}
//                         onChange={changeHandler}
//                         className='border border-black p-2 rounded  '/>
//                         </div>

//                     </div>
               
//                    {/* for toss */}
//                    <div className='flex flex-col w-[50%] border border-gray-500 py-3 rounded-md'>
                       
//                         <div className='flex px-5  justify-between border-b border-b-gray-500  py-2'>
//                             <div>Toss Winner</div>
//                             <div>Chose To</div>
//                         </div>

//                         <div className='flex px-5 justify-between   py-2'>
//                             <select 
//                             required
//                             name='tossWinner'
//                             value={formData.tossWinner ?? ""}
//                             onChange={changeHandler}>
//                                  <option value="" disabled hidden>Select Team</option>
                               
//                                { teamA &&  
//                                 (<option value={teamA}>
//                                     {state.teams.find( t => t.id === teamA)?. teamName}
//                                 </option>
//                                 )}

//                                 { teamB &&
//                                     (<option value={teamB}>
//                                     {state.teams.find( t => t.id === teamB)?. teamName}
//                                      </option>
//                                 )
//                                 }
//                             </select>

//                              <select className="border border-black rounded w-20 py-1 "
//                              required
//                              name='tossDecision'
//                              value={formData.tossDecision}
//                              onChange={changeHandler}
//                              >
//                                 <option value="" hidden disabled>Select</option>
//                                 <option>Bat</option>
//                                 <option>Bowl</option>
//                              </select>
//                         </div>
//                    </div>

//               <button className='bg-[#142d4c] py-2 px-4 border border-black rounded-xl text-white'>
//                 Create Match
//               </button>   

//             </form>

           
//         </div>
//     </div>
//   )
// }

// export default AddMatch