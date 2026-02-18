import React, { useContext , useState } from "react";
import { AppContext } from "../context/AppContext";
import { MdArrowBackIosNew } from "react-icons/md";
import { useNavigate} from "react-router-dom";
import toast from "react-hot-toast";

const LiveScore = () => {

  const {state , dispatch} = useContext(AppContext);
  const navigate = useNavigate();

  const [showWicketMenu, setShowWicketMenu] = useState(false);

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

  const currentInnings = currentMatch.innings?.[currentMatch.currentInnings - 1];

  const totalBalls = currentInnings?.balls ?? 0;
   
  // const overDisplay = `${currentInnings.oversCompleted}.${currentInnings.ballsInOver}`;
  const oversCompleted = Math.floor(currentInnings.balls / 6);
  const ballsInOver = currentInnings.balls % 6;
  const overDisplay = `${oversCompleted}.${ballsInOver}`;


  const teamA = state.teams.find( t => t.id === currentMatch.teamAId);
  const teamB = state.teams.find( t => t.id === currentMatch.teamBId);

  const tossLoserId = currentMatch.tossWinnerId === currentMatch.teamAId ? currentMatch.teamBId : currentMatch.teamAId;


  const battingTeamId = currentMatch?.tossDecision === "Bat" ? currentMatch?.tossWinnerId : tossLoserId;
  const bowlingTeamId = currentMatch?.tossDecision === "Bat" ? tossLoserId :currentMatch?.tossWinnerId;
  
  const battingTeam = state.teams.find( t => t.id === battingTeamId);
  const bowlingTeam = state.teams.find( t => t.id === bowlingTeamId);

  const battingTeamName = battingTeam?.teamName || "";
  const bowlingTeamName = bowlingTeam?.teamName || "";

  const battingTeamPlayers = state.players.filter(p => p.teamId === battingTeamId)
  const bowlingTeamPlayers = state.players.filter(p => p.teamId === bowlingTeamId)

  const bowlers =  bowlingTeamPlayers.filter( p => p.playerRole === "Bowler" || p.playerRole === "All Rounder"  )

  return (
    <div className="w-full min-h-screen px-12 py-8 bg-gray-50">
      <div className='left-5 top-5 absolute cursor-pointer' 
                      onClick={()=> {navigate(-1) || navigate('/matches')}}>
                      <MdArrowBackIosNew/>
                    </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold capitalize">
          {teamA?.teamName}
          <div>vs</div>
          {teamB?.teamName}
        </h1>
        <p className="text-gray-600 mt-1">
          Innings 1 of 2 · <span className="capitalize font-bold">Batting: </span> 
            <span className="capitalize">{battingTeamName}</span> 
            · <span className="font-bold">Bowling: </span> 
            <span className="capitalize">{bowlingTeamName}</span> 
            · <span className="font-bold">{currentMatch.overs} Over</span>
        </p>
      </div>

      {/* Score Summary */}
      <div className="bg-white border rounded-lg p-4 mb-8">
        <h2 className="text-xl font-semibold capitalize">{battingTeam?.teamName} - {currentInnings?.runs ?? 0}/{currentInnings.wickets ?? 0} ({overDisplay})</h2>
        <p className="text-gray-500 mt-1">Target: —</p>
      </div>

      {/* Batting + Bowling */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">

        {/* Batting */}
        <div className="bg-white border rounded-lg p-5">
          <h3 className="text-lg font-semibold mb-4 capitalize">Batting — {battingTeam?.teamName}</h3>

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

             const isStriker = p.id === currentInnings.strikerId;
              const isNonStriker = p.id === currentInnings.nonStrikerId;
              const isOut = currentInnings.dismissedPlayers.includes(p.id);

              const stats = currentInnings.battingStats[p.id] || {};

            return (
              <div
              key={p.id}
              className={`py-3 flex border-b last:border-none 
              ${(isStriker || isNonStriker) ? "bg-blue-100" : ""}`}
              >
                
              <span className="w-1/2">
                {isStriker && "* "}
                {p.playerName}
                {isOut && " W"}
              </span>

              <div className="flex w-1/2 text-center">
                <span className="w-full">{stats.runs ?? 0}</span>
                <span className="w-full">{stats.balls ?? 0}</span>
                <span className="w-full">{stats.fours ?? 0}</span>
                <span className="w-full">{stats.sixes ?? 0}</span>
                <span className="w-full">{stats.sr ?? 0}</span>
              </div>
            </div>
             )
          })}
        </div>

        {/* Bowling */}
        <div className="bg-white border rounded-lg p-5">
          <h3 className="text-lg font-semibold mb-4 capitalize">Bowling — {bowlingTeam?.teamName}</h3>

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

            const isSelected = b.id === currentInnings.bowlerId;
            const canChange = currentInnings.ballsInOver === 0;

            // get bowler match stats
              const stats = currentInnings.bowlingStats[b.id] || {
                runs: 0,
                balls: 0,
                wickets: 0,
                er: 0
              };

               // calculate overs from balls
              const oversCompleted = Math.floor(stats.balls / 6);
              const ballsInOver = stats.balls % 6;
              const oversDisplay = `${oversCompleted}.${ballsInOver}`;

              return (
            
            <div key={b.id} 
             onClick={() => {
              if(!canChange) 
              {
                 toast.error("Cannot change bowler before over is completed");
                 return;
              }

              dispatch({
                  type: "SET_BOWLER",
                  payload: {bowlerId: b.id}
                 });

                 toast.success("Bowler selected"); 
             }}

             
            className={`py-3 flex border-b last:border-none cursor-pointer
             ${isSelected ? "bg-blue-200" : ""}
             ${!canChange ? "opacity-60 cursor-not-allowed" : ""}`}>

              <span className="w-1/2">{b.playerName}</span>

              <div className="flex w-1/2 text-center">
                <span className="w-full">{overDisplay}</span>
                <span className="w-full">{stats.runs}</span>
                <span className="w-full">{stats.wickets}</span>
                <span className="w-full">{stats.er}</span>
              </div>
            </div>

              )} )
              }
        </div>
      </div>

      {/* Run Buttons */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Add Runs</h3>
        <div className="flex gap-3 flex-wrap">
          {[0, 1, 2, 3, 4, 6].map((run) => (
            <button
              key={run}
              onClick={ () => 
                dispatch({
                  type: "ADD_RUN",
                  payload: { runs: run}
                })
              }
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
        {["Wide", "No-ball"].map((extra) => (
          <button
            key={extra}
            className="px-4 py-2 border rounded bg-white
                       hover:bg-gray-900 hover:text-white
                       transition-colors duration-200"
          >
            {extra}
          </button>
        ))}

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
              dispatch({
                type: "ADD_WICKET",
                payload: { outPlayerId: currentInnings.strikerId }
              });
              setShowWicketMenu(false);
            }}
            className="hover:bg-gray-100 px-3 py-1 rounded"
          >
            Striker Out
          </button>

          <button
            onClick={() => {
              dispatch({
                type: "ADD_WICKET",
                payload: { outPlayerId: currentInnings.nonStrikerId }
              });
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
        >
          Finish Match
        </button>
      </div>

    </div>
  );
};

export default LiveScore;
