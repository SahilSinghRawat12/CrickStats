import React, { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";

const DashContent = () => {

  const { state } = useContext(AppContext);
  const navigate = useNavigate();

  const recentMatches = [...state.matches].slice(-5).reverse();

  return (
    <div className="flex flex-col gap-y-10 ml-10 w-[65%] ">

      {/* Dashboard Title */}

      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
      </div>


      {/* QUICK STATS */}

      <div className="grid grid-cols-4 gap-6">

        <div className="bg-blue-500 text-white p-6 rounded-lg shadow">
          <p className="text-3xl font-bold">{state.teams.length}</p>
          <p>Total Teams</p>
        </div>

        <div className="bg-green-500 text-white p-6 rounded-lg shadow">
          <p className="text-3xl font-bold">{state.players.length}</p>
          <p>Total Players</p>
        </div>

        <div className="bg-purple-500 text-white p-6 rounded-lg shadow">
          <p className="text-3xl font-bold">{state.matches.length}</p>
          <p>Total Matches</p>
        </div>

        <div className="bg-orange-500 text-white p-6 rounded-lg shadow">
          <p className="text-3xl font-bold">
            {state.matches.filter(m => m.isFinished).length}
          </p>
          <p>Completed Matches</p>
        </div>

      </div>


      {/* QUICK ACTIONS */}

      <div className="flex gap-6">

        <button
          onClick={() => navigate("/teams")}
          className="bg-blue-600 text-white px-5 py-3 rounded-md shadow hover:bg-blue-700"
        >
          Create Team
        </button>

        <button
          onClick={() => navigate("/matches")}
          className="bg-purple-600 text-white px-5 py-3 rounded-md shadow hover:bg-purple-700"
        >
          Create Match
        </button>

      </div>



      {/* RECENT MATCHES */}

      <div>

        <div className="py-4">
          <h1 className="text-2xl font-bold">Recent Matches</h1>
        </div>

        <div className="flex flex-col bg-white shadow-md rounded-lg">

          {/* Header */}

          <div className="flex gap-5 justify-around items-center p-4 border-b font-semibold">

            <div className="w-full">Match</div>
            <div className="w-full">Score</div>
            <div className="w-full">Winner</div>

          </div>


          {/* Matches */}

          {recentMatches.length === 0 && (
            <div className="p-5 text-gray-500">
              No Matches Yet
            </div>
          )}


          {recentMatches.map(match => {

            const teamA = state.teams.find(t => t.id === match.teamAId);
            const teamB = state.teams.find(t => t.id === match.teamBId);

            const firstInnings = match.innings[0];
            const secondInnings = match.innings[1];

            const score = firstInnings
              ? `${firstInnings.runs}/${firstInnings.wickets}`
              : "-";

            const winner = state.teams.find(
              t => t.id === match.winnerTeamId
            );

            return (

              <div
                key={match.id}
                className="flex gap-5 justify-around items-center p-4 border-b"
              >

                <div className="w-full">
                  {teamA?.teamName} vs {teamB?.teamName}
                </div>

                <div className="w-full">
                  {score}
                </div>

                <div className="w-full">
                  {winner?.teamName || "In Progress"}
                </div>

              </div>

            );

          })}

        </div>

      </div>



      {/* TEAMS OVERVIEW */}

      <div>

        <h1 className="text-2xl font-bold mb-4">
          Teams Overview
        </h1>

        <div className="grid grid-cols-2 gap-6">

          {state.teams.map(team => {

            const players = state.players.filter(
              p => p.teamId === team.id
            );

            return (

              <div
                key={team.id}
                className="bg-white border-2  shadow rounded-lg p-5 flex justify-between"
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