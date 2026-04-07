import React, { useContext, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import { FetchContext } from "../../context/FetchContext";
import {signOut} from "../../utils/auth"
import toast from "react-hot-toast";


const DashContent = () => {

  const { state, dispatch } = useContext(AppContext);
  const {getMatchesWithInnings , getTeams , getPlayers} = useContext(FetchContext);
  const navigate = useNavigate();

  const recentMatches = [...state.matches].slice(-5).reverse();

  const handleLogout = async () => {
  const { error } = await signOut();

  if (error) {
    toast.error("Logout failed");
    return;
  }

  toast.success("Logged out");

  navigate("/login");
  };

  useEffect(()=>{
    const loadData = async() =>{

      const teams = await getTeams();
      const players = await getPlayers();
      const matches = await getMatchesWithInnings();

      dispatch({ type: "SET_TEAMS" , payload: teams});
      dispatch({ type: "SET_PLAYERS" , payload: players});
      dispatch({ type: "SET_MATCHES" , payload: matches});
    };

    loadData();
  }, []);

  return (
   <div className="flex flex-col pt-5 gap-y-8 px-3 sm:px-6 md:ml-10 md:w-[90%] w-full max-w-6xl mx-auto">

  {/* Header */}
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md: mt-14">

    <h1 className="text-xl md:text-2xl font-semibold">
      Dashboard
    </h1>

    <button 
      className="bg-red-500 px-4 py-2 text-white rounded-md hover:bg-red-700 
                 w-full sm:w-auto mt-2 "
      onClick={handleLogout}
    >
      Log Out
    </button>
  </div>

  {/* STATS */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 justify-center">

    <div className="bg-blue-500 text-white p-4 rounded-lg shadow">
      <p className="text-2xl font-bold">{state.teams.length}</p>
      <p>Total Teams</p>
    </div>

    <div className="bg-green-500 text-white p-4 rounded-lg shadow">
      <p className="text-2xl font-bold">{state.players.length}</p>
      <p>Total Players</p>
    </div>

    <div className="bg-purple-500 text-white p-4 rounded-lg shadow">
      <p className="text-2xl font-bold">{state.matches.length}</p>
      <p>Total Matches</p>
    </div>

    <div className="bg-orange-500 text-white p-4 rounded-lg shadow">
      <p className="text-2xl font-bold">
        {state.matches.filter(m => m.isfinished).length}
      </p>
      <p>Completed Matches</p>
    </div>

  </div>

  {/* ACTIONS */}
  <div className="flex flex-col sm:flex-row gap-3">

    <button
      onClick={() => navigate("/teams")}
      className="bg-blue-600 text-white px-5 py-3 rounded-md shadow hover:bg-blue-700 w-full sm:w-auto"
    >
      Create Team
    </button>

    <button
      onClick={() => navigate("/matches")}
      className="bg-purple-600 text-white px-5 py-3 rounded-md shadow hover:bg-purple-700 w-full sm:w-auto"
    >
      Create Match
    </button>

  </div>

  {/* RECENT MATCHES */}
  <div>

    <div className="py-2">
      <h1 className="text-xl md:text-2xl font-bold">Recent Matches</h1>
    </div>

    <div className="flex flex-col bg-white shadow-md rounded-lg overflow-hidden">

      {/* Header */}
      <div className="hidden sm:flex justify-between p-4 border-b font-semibold">
        <div className="w-1/3">Match</div>
        <div className="w-1/3">Score</div>
        <div className="w-1/3">Winner</div>
      </div>

      {/* No Matches */}
      {recentMatches.length === 0 && (
        <div className="p-5 text-gray-500">
          No Matches Yet
        </div>
      )}

      {/* Matches */}
      {
        recentMatches.map(match => {

          const teamA = state.teams.find(t => t.id === match.team_a_id);
          const teamB = state.teams.find(t => t.id === match.team_b_id);

          const innings = match.match_innings || [];

          innings.sort(
            (a, b) => new Date(a.created_at) - new Date(b.created_at)
          );

          const firstInnings = innings[0];
          const secondInnings = innings[1];

          let score = "-";

          if (firstInnings && !secondInnings) {
            score = `${firstInnings.runs}/${firstInnings.wickets}`;
          }

          if (firstInnings && secondInnings) {
            score = `${secondInnings.runs}/${secondInnings.wickets}`;
          }

          const balls = secondInnings?.balls ?? firstInnings?.balls ?? 0;
          const overs = `${Math.floor(balls / 6)}.${balls % 6}`;

          const winner = state.teams.find(
            t => t.id === match.winner_team_id
          );

          return (

            <div
              key={match.id}
              className="flex flex-col sm:flex-row gap-2 sm:gap-5 p-4 border-b"
            >

              <div className="sm:w-1/3 font-medium capitalize">
                {teamA?.team_name} vs {teamB?.team_name}
              </div>

              <div className="sm:w-1/3">
                {score} ({overs})
              </div>

              <div className="sm:w-1/3">
                {
                  match.isfinished
                  ? winner?.team_name 
                  : "LIVE"
                }
              </div>

            </div>

          );

        })
      }

    </div>

  </div>

  {/* TEAMS */}
  <div>

    <h1 className="text-xl md:text-2xl font-bold mb-4">
      Teams Overview
    </h1>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

      {state.teams.map(team => {

        const players = state.players.filter(
          p => p.team_id === team.id
        );

        return (

          <div
            key={team.id}
            className="bg-white border shadow rounded-lg p-4 flex justify-between"
          >
            <p className="font-semibold capitalize">
              {team.team_name}
            </p>

            <p className="text-gray-500">
              {players.length} Players
            </p>
          </div>

        );

      })}

    </div>

  </div>

</div>
  );
};

export default DashContent;