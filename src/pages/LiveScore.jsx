import React, { useContext } from "react";
import { battingPlayers, bowlingPlayers } from "../data/data";
import { AppContext } from "../context/AppContext";
import { MdArrowBackIosNew } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const LiveScore = () => {

  const {state} = useContext(AppContext);
  const navigate = useNavigate();

  const currentMatch = state.matches.find( (match) => match.id === state.currentMatchId);
  const teamA = state.teams.find( t => t.id === currentMatch.teamAId);
  const teamB = state.teams.find( t => t.id === currentMatch.teamBId);

  const teamAPlayers = state.players.filter( p => p.teamId === teamA.id)
  const teamBPlayers = state.players.filter(p => p.teamId === teamB.id)

   const teamBbowlers = teamBPlayers.filter( bowler => (bowler.playerRole === "Bowler" || bowler.playerRole === "All Rounder"))

  const tossWinner = state.teams.find( team => team.id === currentMatch?.tossWinnerId)

  const tossLoserId = currentMatch.tossWinnerId === currentMatch.teamAId ? currentMatch.teamBId : currentMatch.teamAId;

  const tossLoser = state.teams.find( team => team.id === tossLoserId)
  

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
            <span className="capitalize">{(currentMatch.tossDecision === "Bat") ? (tossWinner?.teamName) : (tossLoser?.teamName)}</span> 
            · <span className="font-bold">Bowling: </span> 
            <span className="capitalize">{(currentMatch.tossDecision === "Bowl") ? (tossWinner.teamName) : (tossLoser?.teamName)}</span> 
            · <span className="font-bold">{currentMatch.overs} Over</span>
        </p>
      </div>

      {/* Score Summary */}
      <div className="bg-white border rounded-lg p-4 mb-8">
        <h2 className="text-xl font-semibold capitalize">{(currentMatch.tossDecision === "Bat") ? (tossWinner?.teamName) : (tossLoser?.teamName)} - 125/3 (14.2)</h2>
        <p className="text-gray-500 mt-1">Target: —</p>
      </div>

      {/* Batting + Bowling */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">

        {/* Batting */}
        <div className="bg-white border rounded-lg p-5">
          <h3 className="text-lg font-semibold mb-4 capitalize">Batting — {(currentMatch.tossDecision === "Bat") ? (tossWinner?.teamName) : (tossLoser?.teamName)}</h3>

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

          {teamAPlayers.map((p) => (
            <div key={p.id} className="py-3 flex border-b last:border-none">
              <span className="w-1/2">{p.playerName}</span>
              <div className="flex w-1/2 text-center">
                <span className="w-full">{p.runs}</span>
                <span className="w-full">{p.balls}</span>
                <span className="w-full">{p.fours}</span>
                <span className="w-full">{p.sixes}</span>
                <span className="w-full">{p.sr}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bowling */}
        <div className="bg-white border rounded-lg p-5">
          <h3 className="text-lg font-semibold mb-4 capitalize">Bowling — {(currentMatch.tossDecision === "Bowl") ? (tossWinner.teamName) : (tossLoser?.teamName)}</h3>

          <div className="border-b pb-2 flex text-sm font-medium text-gray-600">
            <span className="w-1/2">Bowler</span>
            <div className="flex w-1/2 text-center">
              <span className="w-full">O</span>
              <span className="w-full">R</span>
              <span className="w-full">W</span>
              <span className="w-full">ER</span>
            </div>
          </div>

          {teamBbowlers.map((b) => (

               <div key={b.id} className="py-3 flex border-b last:border-none">
              <span className="w-1/2">{b.playerName}</span>
              <div className="flex w-1/2 text-center">
                <span className="w-full">{b.overs}</span>
                <span className="w-full">{b.runs}</span>
                <span className="w-full">{b.wickets}</span>
                <span className="w-full">{b.er}</span>
              </div>
            </div>
            
           
          ))}
        </div>
      </div>

      {/* Run Buttons */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Add Runs</h3>
        <div className="flex gap-3 flex-wrap">
          {[0, 1, 2, 3, 4, 6].map((run) => (
            <button
              key={run}
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
        {["Wide", "No-ball", "Byes", "Leg Byes", "Wicket"].map((extra) => (
          <button
            key={extra}
            className="px-4 py-2 border rounded bg-white
                       hover:bg-gray-900 hover:text-white
                       transition-colors duration-200"
          >
            {extra}
          </button>
        ))}
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
