import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseCleint";

const MatchSummary = () => {

  const { state } = useContext(AppContext);
  const navigate = useNavigate();

  const [innings, setInnings] = useState([]);
  const [battingStats, setBattingStats] = useState([]);
  const [bowlingStats, setBowlingStats] = useState([]);

  const match = state.matches.find(
    m => String(m.id) === String(state.currentMatchId)
  );

  useEffect(() => {
    if (!match) return;

    const loadData = async () => {

      const { data: inningsData } = await supabase
        .from("match_innings")
        .select("*")
        .eq("match_id", match.id)
        .order("created_at", { ascending: true });

      setInnings(inningsData || []);

      const { data: batStats } = await supabase
        .from("batting_stats")
        .select("*")
        .eq("match_id", match.id);

      setBattingStats(batStats || []);

      const { data: bowlStats } = await supabase
        .from("bowling_stats")
        .select("*")
        .eq("match_id", match.id);

      setBowlingStats(bowlStats || []);
    };

    loadData();
  }, [match]);

  if (!match) return <div>No Match Found</div>;

  const teamA = state.teams.find(t => t.id === match.team_a_id);
  const teamB = state.teams.find(t => t.id === match.team_b_id);

  const firstInnings = innings[0];
  const secondInnings = innings[1];

  const firstTeam = state.teams.find(
    t => t.id === firstInnings?.batting_team_id
  );

  const secondTeam = state.teams.find(
    t => t.id === secondInnings?.batting_team_id
  );

  const winner = state.teams.find(
    t => t.id === match.winner_team_id
  );

  const getPlayers = (teamId) =>
    state.players.filter(p => p.team_id === teamId);

  return (
    <div className="min-h-screen bg-gray-100 p-10">

      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="bg-white shadow rounded-xl p-6 mb-6">
          <h1 className="text-3xl font-bold text-center mb-2">
            Match Summary
          </h1>

          <p className="text-center text-gray-600 capitalize">
            {teamA?.team_name} vs {teamB?.team_name}
          </p>
        </div>

        {/* RESULT */}
        <div className="bg-green-100 border border-green-300 rounded-xl p-6 text-center mb-8 capitalize">
          <h2 className="text-2xl font-bold text-green-700">
            {winner?.team_name} {match.result_text}
          </h2>
        </div>

        {/* MATCH INFO */}
        <div className="bg-white shadow rounded-xl p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Match Info</h3>

          <div className="grid grid-cols-2 gap-4 text-gray-700">
            <p><b>Overs:</b> {match.overs}</p>

            <p>
              <b>Toss Winner:</b>{" "}
             <span className="capitalize">{state.teams.find(t => t.id === match.toss_winner_id)?.team_name}</span>
            </p>

            <p className="capitalize"><b>Toss Decision:</b> {match.toss_decision}</p>
            <p><b>Date:</b> {match.date}</p>
          </div>
        </div>

        {/* FIRST INNINGS */}
        {firstInnings && (
          <div className="bg-white shadow rounded-xl p-6 mb-8">

            <h2 className="text-xl font-semibold mb-4 capitalize">
              {firstTeam?.team_name} — {firstInnings.runs}/{firstInnings.wickets}
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
                {getPlayers(firstTeam?.id).map(p => {

                  const stats = battingStats.find(
                    s => s.player_id === p.id
                  ) || {};

                  return (
                    <tr key={p.id} className="border-b capitalize">
                      <td>{p.player_name}</td>
                      <td>{stats.runs || 0}</td>
                      <td>{stats.balls || 0}</td>
                      <td>{stats.fours || 0}</td>
                      <td>{stats.sixes || 0}</td>
                      <td>
                        {stats.balls
                          ? ((stats.runs / stats.balls) * 100).toFixed(1)
                          : 0}
                      </td>
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
                {getPlayers(secondTeam?.id).map(p => {

                  const stats = bowlingStats.find(
                    s => s.player_id === p.id
                  ) || {};

                  const balls = stats.balls || 0;
                  const overs = `${Math.floor(balls / 6)}.${balls % 6}`;
                  const economy = balls
                    ? (stats.runs / (balls / 6)).toFixed(1)
                    : 0;

                  return (
                    <tr key={p.id} className="border-b capitalize">
                      <td>{p.player_name}</td>
                      <td>{overs}</td>
                      <td>{stats.runs || 0}</td>
                      <td>{stats.wickets || 0}</td>
                      <td>{economy}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

          </div>
        )}

        {/* SECOND INNINGS */}
        {secondInnings && (
          <div className="bg-white shadow rounded-xl p-6 mb-8">

            <h2 className="text-xl font-semibold mb-4 capitalize">
              {secondTeam?.team_name} — {secondInnings.runs}/{secondInnings.wickets}
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
                {getPlayers(secondTeam?.id).map(p => {

                  const stats = battingStats.find(
                    s => s.player_id === p.id
                  ) || {};

                  return (
                    <tr key={p.id} className="border-b capitalize">
                      <td>{p.player_name}</td>
                      <td>{stats.runs || 0}</td>
                      <td>{stats.balls || 0}</td>
                      <td>{stats.fours || 0}</td>
                      <td>{stats.sixes || 0}</td>
                      <td>
                        {stats.balls
                          ? ((stats.runs / stats.balls) * 100).toFixed(1)
                          : 0}
                      </td>
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
                {getPlayers(firstTeam?.id).map(p => {

                  const stats = bowlingStats.find(
                    s => s.player_id === p.id
                  ) || {};

                  const balls = stats.balls || 0;
                  const overs = `${Math.floor(balls / 6)}.${balls % 6}`;
                  const economy = balls
                    ? (stats.runs / (balls / 6)).toFixed(1)
                    : 0;

                  return (
                    <tr key={p.id} className="border-b capitalize">
                      <td>{p.player_name}</td>
                      <td>{overs}</td>
                      <td>{stats.runs || 0}</td>
                      <td>{stats.wickets || 0}</td>
                      <td>{economy}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

          </div>
        )}

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

