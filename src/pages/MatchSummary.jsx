import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { FetchContext } from "../context/FetchContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseCleint";

const MatchSummary = () => {

  const { state, dispatch } = useContext(AppContext);
  const { getMatches, getTeams, getPlayers } = useContext(FetchContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [innings, setInnings] = useState([]);
  const [battingStats, setBattingStats] = useState([]);
  const [bowlingStats, setBowlingStats] = useState([]);

  //  find match AFTER state loads
  const match = state.matches.find(
    m => String(m.id) === String(state.currentMatchId)
  );

  // LOAD ALL DATA ON REFRESH
  useEffect(() => {

    const loadAllData = async () => {

      // restore match id
      const savedMatchId = localStorage.getItem("currentMatchId");

      if (savedMatchId) {
        dispatch({
          type: "SET_CURRENT_MATCH",
          payload: savedMatchId
        });
      }

      // fetch all data
      const teams = await getTeams();
      const players = await getPlayers();
      const matches = await getMatches();

      dispatch({ type: "SET_TEAMS", payload: teams });
      dispatch({ type: "SET_PLAYERS", payload: players });
      dispatch({ type: "SET_MATCHES", payload: matches });

      setLoading(false);
    };

    loadAllData();

  }, []);

  //  fetch innings + stats
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

  //  LOADING UI
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        Loading Match Summary...
      </div>
    );
  }

  //  safety
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

  //  FIXED NAME
  const getTeamPlayers = (teamId) =>
    state.players.filter(p => p.team_id === teamId);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">

  <div className="max-w-6xl mx-auto space-y-8">

    {/* HEADER */}
    <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
      <h1 className="text-3xl font-bold text-gray-800">
        Match Summary
      </h1>

      <p className="text-lg text-gray-600 mt-2 capitalize">
        {teamA?.team_name} <span className="mx-2 text-gray-400">vs</span> {teamB?.team_name}
      </p>
    </div>

    {/* RESULT */}
    <div className="bg-green-100 border border-green-300 rounded-2xl p-5 text-center">
      <h2 className="text-2xl font-bold text-green-700 capitalize">
        {winner?.team_name} {match.result_text}
      </h2>
    </div>

    {/* MATCH INFO */}
    <div className="bg-white shadow rounded-2xl p-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        Match Info
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-gray-700 text-sm">

        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="font-semibold">Overs</p>
          <p>{match.overs}</p>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg capitalize">
          <p className="font-semibold">Toss Winner</p>
          <p>{state.teams.find(t => t.id === match.toss_winner_id)?.team_name}</p>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg capitalize">
          <p className="font-semibold">Decision</p>
          <p>{match.toss_decision}</p>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="font-semibold">Date</p>
          <p>{match.match_date}</p>
        </div>

      </div>
    </div>

    {/* INNINGS COMPONENT */}
    {[firstInnings, secondInnings].map((inn, index) => {
      if (!inn) return null;

      const team =
        index === 0 ? firstTeam : secondTeam;

      const bowlingTeam =
        index === 0 ? secondTeam : firstTeam;

      return (
        <div key={index} className="bg-white shadow rounded-2xl p-6">

          {/* SCORE HEADER */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold capitalize text-gray-800">
              {team?.team_name}
            </h2>

            <span className="text-2xl font-bold text-blue-600">
              {inn.runs}/{inn.wickets}
            </span>
          </div>

          {/* BATSMAN */}
          <h3 className="font-semibold mb-2 text-gray-700">Batting</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border rounded-lg overflow-hidden">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-2">Player</th>
                  <th className="p-2 text-center">R</th>
                  <th className="p-2 text-center">B</th>
                  <th className="p-2 text-center">4s</th>
                  <th className="p-2 text-center">6s</th>
                  <th className="p-2 text-center">SR</th>
                </tr>
              </thead>

              <tbody>
                {getTeamPlayers(team?.id).map(p => {

                  const stats = battingStats.find(
                    s => s.player_id === p.id
                  ) || {};

                  return (
                    <tr key={p.id} className="border-b hover:bg-gray-50">
                      <td className="p-2 capitalize">{p.player_name}</td>
                      <td className="text-center">{stats.runs || 0}</td>
                      <td className="text-center">{stats.balls || 0}</td>
                      <td className="text-center">{stats.fours || 0}</td>
                      <td className="text-center">{stats.sixes || 0}</td>
                      <td className="text-center">
                        {stats.balls
                          ? ((stats.runs / stats.balls) * 100).toFixed(1)
                          : 0}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* BOWLING */}
          <h3 className="font-semibold mt-6 mb-2 text-gray-700">Bowling</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border rounded-lg overflow-hidden">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-2">Bowler</th>
                  <th className="p-2 text-center">O</th>
                  <th className="p-2 text-center">R</th>
                  <th className="p-2 text-center">W</th>
                  <th className="p-2 text-center">ER</th>
                </tr>
              </thead>

              <tbody>
                {getTeamPlayers(bowlingTeam?.id).map(p => {

                  const stats = bowlingStats.find(
                    s => s.player_id === p.id
                  ) || {};

                  const balls = stats.balls || 0;
                  const overs = `${Math.floor(balls / 6)}.${balls % 6}`;
                  const economy = balls
                    ? (stats.runs / (balls / 6)).toFixed(1)
                    : 0;

                  return (
                    <tr key={p.id} className="border-b hover:bg-gray-50">
                      <td className="p-2 capitalize">{p.player_name}</td>
                      <td className="text-center">{overs}</td>
                      <td className="text-center">{stats.runs || 0}</td>
                      <td className="text-center">{stats.wickets || 0}</td>
                      <td className="text-center">{economy}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      );
    })}

    {/* BACK BUTTON */}
    <div className="text-center">
      <button
        onClick={() => navigate("/matches")}
        className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
      >
        Back to Matches
      </button>
    </div>

  </div>
</div>
  );
};

export default MatchSummary;