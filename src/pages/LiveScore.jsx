import React, { useContext , useState , useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { MdArrowBackIosNew } from "react-icons/md";
import { useNavigate} from "react-router-dom";
import toast from "react-hot-toast";
import { supabase } from "../lib/supabaseCleint"
import { FetchContext } from "../context/FetchContext";

const LiveScore = () => {

  const {getPlayers , getTeams , getMatches} = useContext(FetchContext);
  const {state , dispatch} = useContext(AppContext);
  const navigate = useNavigate();

  const [innings , setInnings] = useState(null);

  const [showWicketMenu, setShowWicketMenu] = useState(false);
  const [showNoBallMenu, setShowNoBallMenu] = useState(false);

  const currentMatch = state.matches.find( (match) => match.id === state.currentMatchId);

if (!currentMatch) {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-2xl font-semibold">No Active Match</h1>

      <button
        onClick={() => navigate('/matches')}
        className="px-6 py-2 bg-blue-600 text-white rounded-md
                   hover:bg-blue-700 transition-colors"
      >
        Back to Matches
      </button>
    </div>
  );
}

  useEffect(()=>{
    const loadData = async () => {

      const teams = await getTeams();

      const players = await getPlayers();

      const matches = await getMatches();

       dispatch({
        type: "SET_TEAMS",
        payload: teams
        });

      dispatch({
      type: "SET_PLAYERS",
      payload: players
      });

      dispatch({
         type: "SET_MATCHES",
         payload: matches
       });

    };

    loadData();
  }, [])



async function createFirstInnings(match) {

  // Check existing innings
  const { data: exsistingInnings } = await supabase
    .from("match_innings")
    .select("*")
    .eq("match_id", match.id);

  if (exsistingInnings.length > 0) {
    return; // innings already exists
  }

  //  Determine toss loser
  const tossLoser =
    match.toss_winner_id === match.team_a_id
      ? match.team_b_id
      : match.team_a_id;

  //  Determine batting team
  const battingTeam =
    match.toss_decision === "bat"
      ? match.toss_winner_id
      : tossLoser;

  //  Determine bowling team
  const bowlingTeam =
    battingTeam === match.team_a_id
      ? match.team_b_id
      : match.team_a_id;

  //  Insert first innings
  const battingPlayers = state.players.filter(
  p => p.team_id === battingTeam
  );

  await supabase.from("match_innings").insert({
  match_id: match.id,
  batting_team_id: battingTeam,
  bowling_team_id: bowlingTeam,
  striker_id: battingPlayers[0]?.id,
  non_striker_id: battingPlayers[1]?.id
});

}

//creating first inning
  useEffect(() => {

  if (!currentMatch) {
       return;
  }

  createFirstInnings(currentMatch);

}, [currentMatch]);


//fetching inngins
useEffect(() => {

  if (!currentMatch) return;

  async function fetchInnings() {

    const { data, error } = await supabase
      .from("match_innings")
      .select("*")
      .eq("match_id", currentMatch.id)
      .eq("is_completed", false)
      .maybeSingle();

      if (!data) {
      console.log("No innings found yet");
      return;
    }

    if (error) {
      console.log(error);
      return;
    }

    setInnings(data);
  }

  fetchInnings();

}, [currentMatch]);

const currentInnings = innings;

if (!currentInnings) {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      Loading match...
    </div>
  );
}

const oversCompleted = Math.floor((currentInnings?.balls ?? 0) / 6);
const ballsInOver = (currentInnings?.balls ?? 0) % 6;
const overDisplay = `${oversCompleted}.${ballsInOver}`;

  


  const teamA = state.teams.find( t => t.id === currentMatch.team_a_id);
  const teamB = state.teams.find( t => t.id === currentMatch.team_b_id);

  const tossLoserId = currentMatch.tossWinnerId === currentMatch.teamAId ? currentMatch.teamBId : currentMatch.teamAId;


  const battingTeamId = currentInnings?.batting_team_id;
  const bowlingTeamId = currentInnings?.bowling_team_id;

  const battingTeam = state.teams.find( t => t.id === battingTeamId);
  const bowlingTeam = state.teams.find( t => t.id === bowlingTeamId);

  const battingTeamName = battingTeam?.teamName || "";
  const bowlingTeamName = bowlingTeam?.teamName || "";

  const battingTeamPlayers = state.players.filter(p => p.team_id === battingTeamId)
  const bowlingTeamPlayers = state.players.filter(p => p.team_id === bowlingTeamId)

  const bowlers =  bowlingTeamPlayers.filter( p => p.player_role === "Bowler" || p.player_role === "All Rounder"  )

//bowler selection
async function selectBowler(bowlerId) {

  const { error } = await supabase
    .from("match_innings")
    .update({
      bowler_id: bowlerId
    })
    .eq("id", innings.id);

  if (error) {
    console.log(error);
    toast.error("Failed to select bowler");
    return;
  }

  const { data } = await supabase
    .from("match_innings")
    .select("*")
    .eq("id", innings.id)
    .single();

  setInnings(data);

  toast.success("Bowler Selected");
}


//adding runs 
async function addRun(run) {

  if (!innings) return;

  if (!innings.bowler_id) {
  toast.error("Select a bowler first");
  return;
}

   if (currentMatch.isFinished) {
     toast.error("Match Finished");
     return;
   }

 const maxBalls = currentMatch.overs * 6;

   if (currentInnings.balls >= maxBalls) {
     toast.error("Overs Completed");
     return;
   }


  // calculate over + ball
  const overNumber = Math.floor(innings.balls / 6);
  const ballNumber = (innings.balls % 6) + 1;

  // insert ball
  const { error: ballError } = await supabase
    .from("balls")
    .insert({
      match_id: currentMatch.id,
      innings_id: innings.id,
      batsman_id: innings.striker_id,
      bowler_id: innings.bowler_id,
      over_number: overNumber,
      ball_number: ballNumber,
      runs: run
    });

  if (ballError) {
    console.log(ballError);
    toast.error("Ball insert failed");
    return;
  }

  // update innings
  let newStriker = innings.striker_id;
let newNonStriker = innings.non_striker_id;

// change strike for 1 or 3 runs
if (run === 1 || run === 3) {
  newStriker = innings.non_striker_id;
  newNonStriker = innings.striker_id;
}

// end of over strike change
if ((innings.balls + 1) % 6 === 0) {
  const temp = newStriker;
  newStriker = newNonStriker;
  newNonStriker = temp;
}

  const { error: inningsError } = await supabase
    .from("match_innings")
    .update({
      runs: innings.runs + run,
      balls: innings.balls + 1,
      striker_id: newStriker,
      non_striker_id: newNonStriker
    })
    .eq("id", innings.id);

  if (inningsError) {
    console.log(inningsError);
  }

  //get striker
  const striker = battingTeamPlayers.find( 
    p => p.id === innings.striker_id
  );

  //check existing stats
  const {data: existingStats} = await supabase
  .from("batting_stats")
  .select("*")
  .eq("match_id", currentMatch.id)
  .eq("player_id", striker.id)
  .single();

  //insert or update
  if(!existingStats)
  {

    await supabase.from("batting_stats").insert({
    match_id: currentMatch.id,
    player_id: striker.id,
    runs: run,
    balls: 1,
    fours: run === 4 ? 1 : 0,
    sixes: run === 6 ? 1 : 0
  });

  }  else {

    await supabase
  .from("batting_stats")
  .update({
    runs: existingStats.runs + run,
    balls: existingStats.balls + 1,
    fours: run === 4 ? existingStats.fours + 1 : existingStats.fours,
    sixes: run === 6 ? existingStats.sixes + 1 : existingStats.sixes
  })
  .eq("id", existingStats.id);

  }

  //bowler stats
const bowlerId = innings.bowler_id;

const { data: bowlerStats } = await supabase
.from("bowling_stats")
.select("*")
.eq("match_id", currentMatch.id)
.eq("player_id", bowlerId)
.single();

if (!bowlerStats) {

  await supabase.from("bowling_stats").insert({
    match_id: currentMatch.id,
    player_id: bowlerId,
    runs: run,
    balls: 1
  });

} else {

  await supabase
  .from("bowling_stats")
  .update({
    runs: bowlerStats.runs + run,
    balls: bowlerStats.balls + 1
  })
  .eq("id", bowlerStats.id);

}

  // reload innings
  const { data } = await supabase
    .from("match_innings")
    .select("*")
    .eq("id", innings.id)
    .single();

  setInnings(data);

}


  return (

    <div className="w-full min-h-screen px-12 py-8 bg-gray-50">
      <div className='left-5 top-5 absolute cursor-pointer' 
                      onClick={()=> {navigate(-1) || navigate('/matches')}}>
                      <MdArrowBackIosNew/>
         </div>

       {/*WINNER BANNER */}
    {currentMatch.isFinished && (
  <div className="bg-green-600 text-white p-4 rounded mb-4 text-center font-bold">

    {state.teams.find(t => t.id === currentMatch.winnerTeamId)?.teamName}

    {" "}
    {currentMatch.resultText}

  </div>
    )}


      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold capitalize">
          {teamA?.team_name}
          <div>vs</div>
          {teamB?.team_name}
        </h1>
        <p className="text-gray-600 mt-1">
          Innings {currentMatch.currentInnings} of 2 · <span className="capitalize font-bold">Batting: </span> 
            <span className="capitalize">{battingTeamName}</span> 
            · <span className="font-bold">Bowling: </span> 
            <span className="capitalize">{bowlingTeamName}</span> 
            · <span className="font-bold">{currentMatch.overs} Over</span>
        </p>
      </div>

      {/* Score Summary */}
      <div className="bg-white border rounded-lg p-4 mb-8">
        <h2 className="text-xl font-semibold capitalize">{battingTeam?.team_name} - {currentInnings?.runs ?? 0}/{currentInnings?.wickets ?? 0} ({overDisplay})</h2>
        {
          currentMatch.currentInnings === 2 && 
          (<p className="text-gray-500 mt-1">Target: {currentMatch.target}</p>)
          }
      </div>

      {/* Batting + Bowling */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">

        {/* Batting */}
        <div className="bg-white border rounded-lg p-5">
          <h3 className="text-lg font-semibold mb-4 capitalize">Batting — {battingTeam?.team_name}</h3>

          <div className="border-b pb-2 flex text-sm font-medium text-gray-600">
            <span className="w-1/2">Batsman</span>
            <div className="flex w-1/2 text-center">
              <span className="w-full">R</span>
              <span className="w-full">B</span>
              <span className="w-full">4s</span>
              <span className="w-full">6s</span>
              <span className="w-full">SR</span>
            </div>
          </div>

          {battingTeamPlayers.map((p) => {

            return (
              <div
              key={p.id}
              className="py-3 flex border-b last:border-none">
                
              <span className="w-1/2">
                
                {p.player_name}
                
              </span>

              <div className="flex w-1/2 text-center">
              <span className="w-full">0</span>
              <span className="w-full">0</span>
              <span className="w-full">0</span>
              <span className="w-full">0</span>
              <span className="w-full">0</span>
              </div>
            </div>
             )
          })}
        </div>

        {/* Bowling */}
        <div className="bg-white border rounded-lg p-5">
          <h3 className="text-lg font-semibold mb-4 capitalize">Bowling — {bowlingTeam?.team_name}</h3>

          <div className="border-b pb-2 flex text-sm font-medium text-gray-600">
            <span className="w-1/2">Bowler</span>
            <div className="flex w-1/2 text-center">
              <span className="w-full">O</span>
              <span className="w-full">R</span>
              <span className="w-full">W</span>
              <span className="w-full">ER</span>
            </div>
          </div>

          {
          bowlers.map((b) => {

              return (
            
            <div
              key={b.id}
              className={`py-3 flex border-b last:border-none cursor-pointer
              ${innings?.bowler_id === b.id ? "bg-blue-200" : ""}`}

              onClick={() => selectBowler(b.id)}
              >
              <span className="w-1/2">{b.player_name}</span>

              <div className="flex w-1/2 text-center">
              <span className="w-full">0</span>
              <span className="w-full">0</span>
              <span className="w-full">0</span>
              <span className="w-full">0</span>
              </div>
              </div>
              )} )
              }
        </div>
      </div>

      {/* runs needed and required run rate */}

            {currentMatch.currentInnings === 2 && !currentMatch.isFinished && (

        <div className="mt-2 mb-5 text-gray-700">

          <p>
            Need {runsNeeded} runs from {ballsRemaining} balls
          </p>

          <p>
            Required Run Rate: {requiredRunRate}
          </p>

        </div>

      )}

      {/* Run Buttons */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Add Runs</h3>
        <div className="flex gap-3 flex-wrap">
          {[0, 1, 2, 3, 4, 6].map((run) => (
            <button
              key={run}
              onClick={ () => addRun(run) }
              className="px-6 py-2 bg-white border rounded-md
                         hover:bg-black hover:text-white
                         transition-colors duration-200"
            >
              {run}
            </button>
          ))}
        </div>
      </div>

     
      {/* Extras */}
      <div className="flex gap-3 mb-8">
      
          <button
            className="px-4 py-2 border rounded bg-white
                       hover:bg-gray-900 hover:text-white
                       transition-colors duration-200"

            onClick={() => {

               if (currentMatch.isFinished) {
                    toast.error("Match Finished");
                    return;
                  }

               const maxBalls = currentMatch.overs * 6;

                  if (currentInnings.balls >= maxBalls) {
                    toast.error("Overs Completed");
                    return;
                  }

                if (!currentInnings.bowler_id) {
                  toast.error("Select a bowler first");
                  return;
                }

            

            }}
          >
            Wide
          </button>

          {/* no ball */}

        <div >
          <button
            className="px-4 py-2 border rounded bg-white
                       hover:bg-gray-900 hover:text-white
                       transition-colors duration-200"

           onClick={() => setShowNoBallMenu(prev => !prev)}
          >
            No Ball
          </button>

          {showNoBallMenu && (
          <div className="absolute mt-2 bg-white border rounded shadow p-2 flex flex-col gap-2">

            {[0,1,2,3,4,6].map(r => (
              <button
                key={r}
                onClick={() => {

                   if (currentMatch.isFinished) {
                    toast.error("Match Finished");
                    return;
                  }

                   const maxBalls = currentMatch.overs * 6;

                  if (currentInnings.balls >= maxBalls) {
                    toast.error("Overs Completed");
                    return;
                  }

                  if (!currentInnings.bowlerId) {
                    toast.error("Select bowler first");
                    return;
                  }

               

                  setShowNoBallMenu(false);
                }}
                className="hover:bg-gray-100 px-3 py-1 rounded"
              >
                No ball + {r}
              </button>
            ))}

          </div>
        )}

        </div>

         {/* wicket button */}

        <div >
      <button
        onClick={() => setShowWicketMenu(prev => !prev)}
        className="px-4 py-2 border rounded bg-white hover:bg-gray-900 hover:text-white"
      >
        Wicket
      </button>

      {showWicketMenu && (
        <div className="absolute mt-2 bg-white border rounded shadow p-2 flex flex-col gap-2">

          <button
            onClick={() => {   
              
               if (currentMatch.isFinished) {
                    toast.error("Match Finished");
                    return;
                  }

              const maxBalls = currentMatch.overs * 6;

              if (currentInnings.balls >= maxBalls) {
                toast.error("Overs Completed");
                return;
              }

              if (currentInnings.isCompleted) {
                toast.error("Innings Completed");
                return;
              }

              if (!currentInnings.strikerId) {
                toast.error("No striker available");
                return;
              }

              if (!currentInnings.bowlerId) {
                toast.error("Select a bowler first");
                return;
              }

            
              setShowWicketMenu(false);
            }}
            className="hover:bg-gray-100 px-3 py-1 rounded"
          >
            Striker Out
          </button>

          <button
            onClick={() => {

               if (currentMatch.isFinished) {
                    toast.error("Match Finished");
                    return;
                  }
                  
                  const maxBalls = currentMatch.overs * 6;

              if (currentInnings.balls >= maxBalls) {
                toast.error("Overs Completed");
                return;
              }

              if (currentInnings.isCompleted) {
                toast.error("Innings Completed");
                return;
              }

              if (!currentInnings.strikerId) {
                toast.error("No striker available");
                return;
              }

              if (!currentInnings.bowlerId) {
                toast.error("Select a bowler first");
                return;
              }


             
              setShowWicketMenu(false);
            }}
            className="hover:bg-gray-100 px-3 py-1 rounded"
          >
            Non-Striker Out
          </button>

        </div>
      )}
    </div>
        
      </div>

        


      {/* Actions */}
      <div className="flex gap-4">
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded-md
                     hover:bg-blue-700 transition-colors duration-200"

         
        >
          End Innings
        </button>

        <button
          className="px-6 py-2 bg-red-600 text-white rounded-md
                     hover:bg-red-700 transition-colors duration-200"

           onClick={() => {
            if (!currentMatch.isFinished) {
              toast.error("Match not finished yet");
              return;
            }

            navigate("/match-summary");

          }}
        >
          Finish Match
        </button>
      </div>

    </div>
  );
};

export default LiveScore;
