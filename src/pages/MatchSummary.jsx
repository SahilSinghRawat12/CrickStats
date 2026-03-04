import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const MatchSummary = () => {

  const { state } = useContext(AppContext);
  const navigate = useNavigate();

  const match = state.matches.find(
    m => m.id === state.currentMatchId
  );

  if (!match) return <div>No Match Found</div>;

  const teamA = state.teams.find(t => t.id === match.teamAId);
  const teamB = state.teams.find(t => t.id === match.teamBId);

  const firstInnings = match.innings[0];
  const secondInnings = match.innings[1];

  const firstTeam = state.teams.find(t => t.id === firstInnings.battingTeamId);
  const secondTeam = state.teams.find(t => t.id === secondInnings.battingTeamId);

  const winner = state.teams.find(t => t.id === match.winnerTeamId);

  const getPlayers = (teamId) =>
    state.players.filter(p => p.teamId === teamId);

  return (

    <div className="min-h-screen bg-gray-100 p-10">

      <div className="max-w-5xl mx-auto">

        {/* MATCH HEADER */}

        <div className="bg-white shadow rounded-xl p-6 mb-6">

          <h1 className="text-3xl font-bold text-center mb-2">
            Match Summary
          </h1>

          <p className="text-center text-gray-600">
            {teamA.teamName} vs {teamB.teamName}
          </p>

        </div>


        {/* RESULT */}

        <div className="bg-green-100 border border-green-300 rounded-xl p-6 text-center mb-8">

          <h2 className="text-2xl font-bold text-green-700">
            {winner?.teamName} {match.resultText}
          </h2>

        </div>


        {/* MATCH INFO */}

        <div className="bg-white shadow rounded-xl p-6 mb-8">

          <h3 className="text-xl font-semibold mb-4">Match Info</h3>

          <div className="grid grid-cols-2 gap-4 text-gray-700">

            <p><b>Overs:</b> {match.overs}</p>

            <p>
              <b>Toss Winner:</b>{" "}
              {state.teams.find(t => t.id === match.tossWinnerId)?.teamName}
            </p>

            <p><b>Toss Decision:</b> {match.tossDecision}</p>

            <p><b>Date:</b> {match.date}</p>

          </div>

        </div>



        {/* FIRST INNINGS */}

        <div className="bg-white shadow rounded-xl p-6 mb-8">

          <h2 className="text-xl font-semibold mb-4">
            {firstTeam.teamName} — {firstInnings.runs}/{firstInnings.wickets}
          </h2>

          {/* Batting */}

          <h3 className="font-semibold mb-2">Batting</h3>

          <table className="w-full text-left mb-6">

            <thead className="border-b">
              <tr>
                <th>Player</th>
                <th>R</th>
                <th>B</th>
                <th>4s</th>
                <th>6s</th>
                <th>SR</th>
              </tr>
            </thead>

            <tbody>

              {getPlayers(firstTeam.id).map(p => {

                const stats = firstInnings.battingStats[p.id] || {};

                return (

                  <tr key={p.id} className="border-b">

                    <td>{p.playerName}</td>
                    <td>{stats.runs ?? 0}</td>
                    <td>{stats.balls ?? 0}</td>
                    <td>{stats.fours ?? 0}</td>
                    <td>{stats.sixes ?? 0}</td>
                    <td>{stats.sr ?? 0}</td>

                  </tr>

                );

              })}

            </tbody>

          </table>



          {/* Bowling */}

          <h3 className="font-semibold mb-2">Bowling</h3>

          <table className="w-full text-left">

            <thead className="border-b">
              <tr>
                <th>Bowler</th>
                <th>O</th>
                <th>R</th>
                <th>W</th>
                <th>ER</th>
              </tr>
            </thead>

            <tbody>

              {getPlayers(secondTeam.id).map(p => {

                const stats = firstInnings.bowlingStats[p.id] || {};

                const balls = stats.balls || 0;

                const overs = Math.floor(balls / 6);
                const rem = balls % 6;

                return (

                  <tr key={p.id} className="border-b">

                    <td>{p.playerName}</td>

                    <td>{overs}.{rem}</td>

                    <td>{stats.runs ?? 0}</td>

                    <td>{stats.wickets ?? 0}</td>

                    <td>{stats.er ?? 0}</td>

                  </tr>

                );

              })}

            </tbody>

          </table>

        </div>



        {/* SECOND INNINGS */}

        <div className="bg-white shadow rounded-xl p-6 mb-8">

          <h2 className="text-xl font-semibold mb-4">
            {secondTeam.teamName} — {secondInnings.runs}/{secondInnings.wickets}
          </h2>


          {/* Batting */}

          <h3 className="font-semibold mb-2">Batting</h3>

          <table className="w-full text-left mb-6">

            <thead className="border-b">
              <tr>
                <th>Player</th>
                <th>R</th>
                <th>B</th>
                <th>4s</th>
                <th>6s</th>
                <th>SR</th>
              </tr>
            </thead>

            <tbody>

              {getPlayers(secondTeam.id).map(p => {

                const stats = secondInnings.battingStats[p.id] || {};

                return (

                  <tr key={p.id} className="border-b">

                    <td>{p.playerName}</td>

                    <td>{stats.runs ?? 0}</td>

                    <td>{stats.balls ?? 0}</td>

                    <td>{stats.fours ?? 0}</td>

                    <td>{stats.sixes ?? 0}</td>

                    <td>{stats.sr ?? 0}</td>

                  </tr>

                );

              })}

            </tbody>

          </table>



          {/* Bowling */}

          <h3 className="font-semibold mb-2">Bowling</h3>

          <table className="w-full text-left">

            <thead className="border-b">
              <tr>
                <th>Bowler</th>
                <th>O</th>
                <th>R</th>
                <th>W</th>
                <th>ER</th>
              </tr>
            </thead>

            <tbody>

              {getPlayers(firstTeam.id).map(p => {

                const stats = secondInnings.bowlingStats[p.id] || {};

                const balls = stats.balls || 0;

                const overs = Math.floor(balls / 6);
                const rem = balls % 6;

                return (

                  <tr key={p.id} className="border-b">

                    <td>{p.playerName}</td>

                    <td>{overs}.{rem}</td>

                    <td>{stats.runs ?? 0}</td>

                    <td>{stats.wickets ?? 0}</td>

                    <td>{stats.er ?? 0}</td>

                  </tr>

                );

              })}

            </tbody>

          </table>

        </div>


        {/* BACK BUTTON */}

        <div className="text-center">

          <button
            onClick={() => navigate("/matches")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Matches
          </button>

        </div>

      </div>

    </div>

  );
};

export default MatchSummary;