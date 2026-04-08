  import React, { useContext , useState , useEffect, useMemo } from "react";
  import { AppContext } from "../context/AppContext";
  import { MdArrowBackIosNew } from "react-icons/md";
  import { useNavigate} from "react-router-dom";
  import toast from "react-hot-toast";
  import { supabase } from "../lib/supabaseCleint"
  import { FetchContext } from "../context/FetchContext";

  const LiveScore = () => {

    const getCurrentUser = async () => {
        const {data} = await supabase.auth.getUser();
        return data.user;
    }

    const [loading , setLoading] = useState(true);
    
    const [innings , setInnings] = useState(null);

    const [showWicketMenu, setShowWicketMenu] = useState(false);
    const [showNoBallMenu, setShowNoBallMenu] = useState(false);

    const [battingStats , setBattingStats] = useState([]);
    const [bowlingStats , setBowlingStats] = useState([]);

    const [lastOutPlayer , setLastOutPlayer] = useState(null);

    const [dismissedPlayers , setDismissedPlayers] = useState([]);

    const {getPlayers , getTeams , getMatches} = useContext(FetchContext);

    const {state , dispatch} = useContext(AppContext);

    const navigate = useNavigate();


    const currentMatch = useMemo(() =>
        state.matches.find( (match) => String(match.id) === String(state.currentMatchId)),
    [state.matches, state.currentMatchId]);

      const currentInnings = innings;

        const battingTeamId = currentInnings?.batting_team_id;

   const battingTeamPlayers = useMemo(() =>
  state.players.filter(p => p.team_id === battingTeamId),
    [state.players, battingTeamId]);



// batting and bowling function
  const fetchBattingStats = async () => {
  if (!currentMatch) return;

   const user = await getCurrentUser();

  const { data } = await supabase
    .from("batting_stats")
    .select("*")
    .eq("match_id", currentMatch.id)
    .eq("user_id" , user.id);

  setBattingStats(data || []);
};

const fetchBowlingStats = async () => {
  if (!currentMatch) return;

   const user = await getCurrentUser();
  const { data } = await supabase
    .from("bowling_stats")
    .select("*")
    .eq("match_id", currentMatch.id)
    .eq("user_id" , user.id);

  setBowlingStats(data || []);
};


// loading data 
    useEffect(() => {
  const loadData = async () => {

    // restore match id FIRST
    const savedMatchId = localStorage.getItem("currentMatchId");

    if (savedMatchId) {
      dispatch({
        type: "SET_CURRENT_MATCH",
        payload: savedMatchId
      });
    }
    
    // fetch data
    const teams = await getTeams();
    const players = await getPlayers();
    const matches = await getMatches();

    dispatch({ type: "SET_TEAMS", payload: teams });
    dispatch({ type: "SET_PLAYERS", payload: players });
    dispatch({ type: "SET_MATCHES", payload: matches });

    //  loading done
    setLoading(false);
  };

  loadData();
}, []);




// creatin first inings
  async function createInnings(match) {

    const user = await getCurrentUser();
    
    // Check existing innings
    const { data: existingInnings } = await supabase
      .from("match_innings")
      .select("*")
      .eq("match_id", match.id)
      .eq("user_id", user.id)
      .eq("is_completed" , false);

    if (existingInnings.length > 0) {
      return; // innings already exists
    }

    let battingTeam;
    let bowlingTeam;

    if(match.currentInnings === 1) {
      // first innigns logic

      //  Determine toss loser
    const tossLoser =
      match.toss_winner_id === match.team_a_id
        ? match.team_b_id
        : match.team_a_id;

        //  Determine batting team
      battingTeam =
      match.toss_decision === "bat"
        ? match.toss_winner_id
        : tossLoser;
       } else {
         
        // second innings (reverse teams)
      
   // we take the team which completed the first innings and change the bowling team from that to batting
   
   const {data: firstInnings} = await supabase
      .from("match_innings")
      .select("*")
      .eq("match_id", match.id)
      .eq("user_id" , user.id)
      .eq("is_completed", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

      if (!firstInnings) return;
      
        battingTeam = firstInnings.bowling_team_id;
       }

       // bowling team
       bowlingTeam = 
          battingTeam === match.team_a_id
            ? match.team_b_id
            : match.team_a_id;

      // get players
      const battingPlayers = state.players.filter(
        p => p.team_id === battingTeam
      );

      if(battingPlayers.length === 0) return;

        const { data, error } = await supabase
          .from("match_innings")
          .insert({
            match_id: match.id,
            batting_team_id: battingTeam,
            bowling_team_id: bowlingTeam,
            striker_id: battingPlayers[0]?.id,
            non_striker_id: battingPlayers[1]?.id || null,
            user_id: user.id
          })
          .select()
          .maybeSingle();

        if (!error && data) {
          setInnings(data);
        }
    }
    


  // wickets function
  async function addWicket(type) {
  if (!innings) return;

  if (!innings.bowler_id) {
    toast.error("Select a bowler first");
    return;
  }

  const battingPlayers = state.players.filter(
    p => p.team_id === innings.batting_team_id
  );

  const totalPlayers = battingPlayers.length;

  const currentWickets = innings.wickets || 0;

  // all out check
  if (currentWickets >= totalPlayers - 1) {
    toast.error("All out!");
    return;
  }

  // who is out
  const outPlayerId =
    type === "striker"
      ? innings.striker_id
      : innings.non_striker_id;     

    setLastOutPlayer(outPlayerId);

    // ===== 🔥 INSTANT WICKET UI =====
setDismissedPlayers(prev => [...prev, outPlayerId]);

setInnings(prev => ({
  ...prev,
  wickets: (prev.wickets || 0) + 1,
  balls: (prev.balls || 0) + 1
}));

        // storing wicket in ball
      const user = await getCurrentUser();

      await supabase.from("balls").insert({
        match_id: currentMatch.id,
        innings_id: innings.id,
        batsman_id: outPlayerId,
        bowler_id: innings.bowler_id,
        over_number: Math.floor(innings.balls / 6),
        ball_number: (innings.balls % 6) + 1,
        runs: 0,
        is_wicket: true,
        user_id: user.id
      });

      // get out players from db
   const { data: outData } = await supabase
    .from("balls")
    .select("batsman_id")
    .eq("match_id", currentMatch.id)
    .eq("is_wicket", true)
    .eq("user_id" , user.id);

    const dismissedIds = outData?.map( d => d.batsman_id) || [];

  // finding next batsman
 const usedPlayers = [
  innings.striker_id,
  innings.non_striker_id,
  ...dismissedIds
 ];

  const nextBatsman = battingPlayers.find(
    p => !usedPlayers.includes(p.id)
  );

  // last player logic
if (!nextBatsman) {

  const remainingPlayer =
    type === "striker"
      ? innings.non_striker_id
      : innings.striker_id;

  if (!remainingPlayer) {
    // ALL OUT
    await supabase
      .from("match_innings")
      .update({
        wickets: currentWickets + 1,
        balls: innings.balls + 1,
        is_completed: true
      })
      .eq("id", innings.id)
      .eq("user_id" , user.id);

    toast.error("All out!");
    return;
  }

  // ONE PLAYER LEFT
  await supabase
    .from("match_innings")
    .update({
      wickets: currentWickets + 1,
      balls: innings.balls + 1,
      striker_id: remainingPlayer,
      non_striker_id: null
    })
    .eq("id", innings.id)
    .eq("user_id" , user.id);

  toast("Last player batting alone");
  return;
}

  let newStriker = innings.striker_id;
  let newNonStriker = innings.non_striker_id;

  if (type === "striker") {
    newStriker = nextBatsman.id;
  } else {
    newNonStriker = nextBatsman.id;
  }

  // updating innings
  const { error } = await supabase
    .from("match_innings")
    .update({
      wickets: currentWickets + 1,
      striker_id: newStriker,
      non_striker_id: newNonStriker,
      balls: innings.balls + 1
    })
    .eq("id", innings.id)
    .eq("user_id" , user.id);

  if (error) {
    console.log(error);
    toast.error("Wicket failed");
    return;
  }

    // bowler stats

  // update bowler stats
  const { data: bowlerStats } = await supabase
    .from("bowling_stats")
    .select("*")
    .eq("match_id", currentMatch.id)
    .eq("player_id", innings.bowler_id)
    .eq("user_id" , user.id)
    .maybeSingle();

  if (!bowlerStats) {
    await supabase.from("bowling_stats").insert({
      match_id: currentMatch.id,
      player_id: innings.bowler_id,
      runs: 0,
      balls: 1,
      wickets: 1,
      user_id: user.id
    });
  } else {
    await supabase
      .from("bowling_stats")
      .update({
        balls: bowlerStats.balls + 1,
        wickets: (bowlerStats.wickets || 0) + 1
      })
      .eq("id", bowlerStats.id)
      .eq("user_id" , user.id);
  }
}



  //fetching inngins
  useEffect(() => {

  if (!currentMatch || !state.players.length) return;

  async function loadInnings() {

    const user = await getCurrentUser();
    // Try fetching
    const { data, error } = await supabase
      .from("match_innings")
      .select("*")
      .eq("match_id", currentMatch.id)
      .eq("user_id" , user.id)
      .eq("is_completed", false)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.log(error);
      return;
    }

    // If exists → set
    if (data) {
      setInnings(data);
      return;
    }

    //  create innigns 1st or 2nd automatically
    await createInnings(currentMatch);

  }

  loadInnings();

}, [currentMatch, state.players]);

//fetch batting and bowling stats
useEffect(() => {
  fetchBattingStats();
  fetchBowlingStats();
}, [currentMatch]);


  // supabase realtime for scoring and match
  useEffect(() => {
  if (!currentMatch) return;

  let channel = null;

  const setUpRealtime = async () => {
    const user = await getCurrentUser();
    if(!user) return;

     channel = supabase
    .channel(`live-score-${currentMatch.id}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "match_innings",
        filter: `match_id=eq.${currentMatch.id}&user_id=eq.${user.id}`
      },
      (payload) => {
        setInnings(payload.new);
      }
    )
    .subscribe();

  };

  setUpRealtime();
  
  return () => {
    if(channel){
       supabase.removeChannel(channel);
    }
   
  };
}, [currentMatch]);

//realtime for batting stats and batting stats

useEffect(() => {
  if (!currentMatch) return;

  let channel = null;

  const batBowlRealTime = async () => {
    const user = await getCurrentUser();

    if(!user) return;

  const channel = supabase
    .channel(`stats-${currentMatch.id}`)

    // batting stats
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "batting_stats",
        filter: `match_id=eq.${currentMatch.id}&user_id=eq.${user.id}`
      },
      () => {
        fetchBattingStats();
      }
    )

    //bowling stats
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "bowling_stats",
        filter: `match_id=eq.${currentMatch.id}&user_id=eq.${user.id}`
      },
      () => {
        fetchBowlingStats();
      }
    )

    .subscribe();
  };

  batBowlRealTime();

  return () => {
    if(channel)
    {
      supabase.removeChannel(channel);
    }
  };
}, [currentMatch]);

// fetching out players from db
 useEffect(() => {
  if (!currentMatch) return;

  
  const fetchDismissed = async () => {
  
    const user = await getCurrentUser();

    const { data } = await supabase
      .from("balls")
      .select("batsman_id")
      .eq("match_id", currentMatch.id)
      .eq("is_wicket", true)
      .eq("user_id" , user.id);

    const ids = data?.map(d => d.batsman_id) || [];
    setDismissedPlayers(ids);
  };

  fetchDismissed();
}, [currentMatch, innings]);


// auto finish match
useEffect(() => {
  if (!innings || !currentMatch) return;

  if (currentMatch.currentInnings !== 2) return;
  if (currentMatch.isfinished) return;

  const runs = innings.runs || 0;
  const wickets = innings.wickets || 0;
  const target = currentMatch.target;
  const maxBalls = currentMatch.overs * 6;

  //  chasing team wins
  if (runs >= target) {
    finishMatch();
  }

  //  overs finished or all out
  if (innings.balls >= maxBalls || wickets >= 10) {
    finishMatch();
  }

}, [innings]);



       if (loading) {
       return (
    <div className="w-full h-screen flex items-center justify-center">
      Loading match data...
    </div>
      );
    }

     if (!currentMatch) {
      return (
        <div className="w-full h-screen flex flex-col items-center justify-center gap-6">
          <h1 className="text-2xl font-semibold">No Active Match</h1>

          <button onClick={() => navigate('/matches')}>
            Back to Matches
          </button>
        </div>
      );
    }



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

    const runsNeeded = currentMatch.target
  ? currentMatch.target - (currentInnings.runs || 0)
  : 0;

    const ballsRemaining = (currentMatch.overs * 6) - (currentInnings.balls || 0);

    const requiredRunRate = ballsRemaining > 0
      ? ((runsNeeded * 6) / ballsRemaining).toFixed(2)
      : 0;

    const teamA = state.teams.find( t => t.id === currentMatch.team_a_id);
    const teamB = state.teams.find( t => t.id === currentMatch.team_b_id);



    
    const bowlingTeamId = currentInnings?.bowling_team_id;

    const battingTeam = state.teams.find( t => t.id === battingTeamId);
    const bowlingTeam = state.teams.find( t => t.id === bowlingTeamId);

    const battingTeamName = battingTeam?.team_name || "";
    const bowlingTeamName = bowlingTeam?.team_name || "";



    const bowlingTeamPlayers = state.players.filter(p => p.team_id === bowlingTeamId)

    const bowlers =  bowlingTeamPlayers.filter( p => p.player_role === "Bowler" || p.player_role === "All Rounder"  )

  //bowler selection
  async function selectBowler(bowlerId) {

    // prevent change mid over
      if (innings.balls % 6 !== 0 && innings.bowler_id) {
        toast.error("Cannot change bowler mid over");
        return;
      }

      const user = await getCurrentUser();
      
    const { error } = await supabase
      .from("match_innings")
      .update({
        bowler_id: bowlerId
      })
      .eq("id", innings.id)
      .eq("user_id" , user.id);

    if (error) {
      console.log(error);
      toast.error("Failed to select bowler");
      return;
    }

    // instant ui update
  setInnings(prev => ({
    ...prev,
    bowler_id: bowlerId
  }));

    toast.success("Bowler Selected");
  }


  //adding runs 
  async function addRun(run) {

    if (!innings) return;

    if (!innings.striker_id) {
    toast.error("Waiting for striker");
    return;
  }

  if(dismissedPlayers.includes(innings.striker_id)) {
    toast.error("Striker is out!");
    return;
  }

    if (!innings.bowler_id) {
    toast.error("Select a bowler first");
    return;
  }

    if (currentMatch.isfinished) {
      toast.error("Match Finished");
      return;
    }

    const originalStrikerId = innings.striker_id;

  const maxBalls = currentMatch.overs * 6;

    if (currentInnings.balls >= maxBalls) {
      toast.error("Overs Completed");
      return;
    }


    // calculate over + ball
    const overNumber = Math.floor(innings.balls / 6);
    const ballNumber = (innings.balls % 6) + 1;

    // insert ball
    const user = await getCurrentUser();

    const { error: ballError } = await supabase
      .from("balls")
      .insert({
        match_id: currentMatch.id,
        innings_id: innings.id,
        batsman_id: innings.striker_id,
        bowler_id: innings.bowler_id,
        over_number: overNumber,
        ball_number: ballNumber,
        runs: run,
        user_id: user.id
      });

    if (ballError) {
      console.log(ballError);
      toast.error("Ball insert failed");
      return;
    }

// ===== 🔥 OPTIMISTIC UI UPDATE START =====

const nextBalls = (innings.balls || 0) + 1;
const nextRuns = (innings.runs || 0) + run;

let newStriker = innings.striker_id;
let newNonStriker = innings.non_striker_id;

// strike rotation
if ((run === 1 || run === 3) && innings.non_striker_id) {
  newStriker = innings.non_striker_id;
  newNonStriker = innings.striker_id;
}

// over complete
let newBowler = innings.bowler_id;

if (nextBalls % 6 === 0) {
  const temp = newStriker;
  newStriker = newNonStriker;
  newNonStriker = temp;
  newBowler = null;
}

// 🔥 instant UI update
setInnings(prev => ({
  ...prev,
  runs: nextRuns,
  balls: nextBalls,
  striker_id: newStriker,
  non_striker_id: newNonStriker,
  bowler_id: newBowler
}));

// ===== 🔥 OPTIMISTIC UI UPDATE END =====    

 

  // change strike for 1 or 3 runs
  if ((run === 1 || run === 3) && innings.non_striker_id) {
    newStriker = innings.non_striker_id;
    newNonStriker = innings.striker_id;
  }

  // end of over strike change
 

if (nextBalls % 6 === 0) {
  
  // strike change
  const temp = newStriker;
  newStriker = newNonStriker;
  newNonStriker = temp;

  // remove bowler (force reselect)
  newBowler = null;

  toast.success("Over completed! Select new bowler");
}

    const { error: inningsError } = await supabase
      .from("match_innings")
      .update({
        runs:nextRuns,
        balls: nextBalls,
        striker_id: newStriker,
        non_striker_id: newNonStriker,
        bowler_id: newBowler,
      })
      .eq("id", innings.id)
      .eq("user_id" , user.id);

    if (inningsError) {
      console.log(inningsError);
    }

     // check win in 2nd innings
if (currentMatch.currentInnings === 2) {
  if (innings.runs + run >= currentMatch.target) {

    // await supabase
    //   .from("matches")
    //   .update({
    //     isfinished: true,
    //     winner_team_id: innings.batting_team_id,
    //     result_text: "won by chasing"
    //   })
    //   .eq("id", currentMatch.id);

    // toast.success("Match Finished!");
  }
} 

    //get striker
    const striker = battingTeamPlayers.find(
    p => String(p.id) === String(originalStrikerId)
    );

    // ===== 🔥 INSTANT BATTING UI =====
setBattingStats(prev => {
  const existing = prev.find(s => s.player_id === originalStrikerId);

  if (!existing) {
    return [
      ...prev,
      {
        player_id: originalStrikerId,
        runs: run,
        balls: 1,
        fours: run === 4 ? 1 : 0,
        sixes: run === 6 ? 1 : 0
      }
    ];
  }

  return prev.map(s =>
    s.player_id === originalStrikerId
      ? {
          ...s,
          runs: s.runs + run,
          balls: s.balls + 1,
          fours: run === 4 ? s.fours + 1 : s.fours,
          sixes: run === 6 ? s.sixes + 1 : s.sixes
        }
      : s
  );
});

    if (!striker) {
  toast.error("Striker not ready yet");
  return;
    }

    //check existing stats

    const {data: existingStats} = await supabase
    .from("batting_stats")
    .select("*")
    .eq("match_id", currentMatch.id)
    .eq("player_id", striker.id)
    .eq("user_id" , user.id)
    .maybeSingle();

    //insert or update
    
    if(!existingStats)
    {

      await supabase.from("batting_stats").insert({
      match_id: currentMatch.id,
      player_id: striker.id,
      runs: run,
      balls: 1,
      fours: run === 4 ? 1 : 0,
      sixes: run === 6 ? 1 : 0,
      user_id: user.id
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
  const bowlerId =  innings.bowler_id;

  const { data: bowlerStats } = await supabase
  .from("bowling_stats")
  .select("*")
  .eq("match_id", currentMatch.id)
  .eq("player_id", bowlerId)
  .eq("user_id" , user.id)
  .maybeSingle();

  if (!bowlerStats) {

    await supabase.from("bowling_stats").insert({
      match_id: currentMatch.id,
      player_id: bowlerId,
      runs: run,
      balls: 1,
      user_id: user.id
    });

  } else {

    await supabase
    .from("bowling_stats")
    .update({
      runs: bowlerStats.runs + run,
      balls: bowlerStats.balls + 1
    })
    .eq("id", bowlerStats.id)
    .eq("user_id" , user.id);

  }


  };


  //adding wide 
  async function addWide()
  {
   if (!innings) return;

  if (!innings.bowler_id) {
    toast.error("Select a bowler first");
    return;
  }

  const maxBalls = currentMatch.overs * 6;

if (innings.balls >= maxBalls) {
  toast.error("Overs Completed");
  return;
}

  if (currentMatch.isfinished) {
    toast.error("Match Finished");
    return;
  }

   // insert ball

   const overNumber = Math.floor(innings.balls / 6);
  const ballNumber = (innings.balls % 6) + 1;

  const user = await getCurrentUser();

  const { error: ballError } = await supabase
    .from("balls")
    .insert({
      match_id: currentMatch.id,
      innings_id: innings.id,
      batsman_id: innings.striker_id,
      bowler_id: innings.bowler_id,
      over_number: overNumber,
      ball_number: ballNumber,
      runs: 1,
      extra_type: "wide",
      user_id: user.id
    });

     if (ballError) {
    console.log(ballError);
    toast.error("Wide failed");
    return;
  }

  // update innings (no ball count increase)
  await supabase
    .from("match_innings")
    .update({
      runs: innings.runs + 1
    })
    .eq("id", innings.id)
    .eq("user_id" , user.id);


    // updating bowler stats
    const bowlerId = innings.bowler_id;

const { data: bowlerStats } = await supabase
  .from("bowling_stats")
  .select("*")
  .eq("match_id", currentMatch.id)
  .eq("player_id", bowlerId)
  .eq("user_id" , user.id)
  .maybeSingle();

if (!bowlerStats) {
  await supabase.from("bowling_stats").insert({
    match_id: currentMatch.id,
    player_id: bowlerId,
    runs: 1,
    user_id: user.id
  });
} else {
  await supabase
    .from("bowling_stats")
    .update({
      runs: bowlerStats.runs + 1
    })
    .eq("id", bowlerStats.id)
    .eq("user_id" , user.id);
}
  }
  

  //Adding No Ball
  async function addNoBall(extraRuns) {
  if (!innings) return;

  if (!innings.bowler_id) {
    toast.error("Select bowler first");
    return;
  }

  const maxBalls = currentMatch.overs * 6;

if (innings.balls >= maxBalls) {
  toast.error("Overs Completed");
  return;
}

  if (currentMatch.isfinished) {
    toast.error("Match Finished");
    return;
  }

  const totalRuns = 1 + extraRuns;

  // insert ball
  const overNumber = Math.floor(innings.balls / 6);
  const ballNumber = (innings.balls % 6) + 1;

  const user = await getCurrentUser();
  const { error: ballError } = await supabase
    .from("balls")
    .insert({
      match_id: currentMatch.id,
      innings_id: innings.id,
      batsman_id: innings.striker_id,
      bowler_id: innings.bowler_id,
      over_number: overNumber,
      ball_number: ballNumber,
      runs: totalRuns,
      extra_type: "no_ball",
      user_id: user.id
    });

  if (ballError) {
    console.log(ballError);
    toast.error("No ball failed");
    return;
  }

  // strike change logic
  let newStriker = innings.striker_id;
  let newNonStriker = innings.non_striker_id;

  if (extraRuns % 2 === 1) {
    newStriker = innings.non_striker_id;
    newNonStriker = innings.striker_id;
  }

  // update innings (NO BALL COUNT INCREASE)
  await supabase
    .from("match_innings")
    .update({
      runs: innings.runs + totalRuns,
      striker_id: newStriker,
      non_striker_id: newNonStriker
    })
    .eq("id", innings.id)
    .eq("user_id" , user.id);

    // BATSMAN STATS UPDATE

const originalStrikerId = innings.striker_id;

if (extraRuns > 0) {

  const { data: existingStats } = await supabase
    .from("batting_stats")
    .select("*")
    .eq("match_id", currentMatch.id)
    .eq("player_id", originalStrikerId)
    .eq("user_id" , user.id)
    .maybeSingle();

  if (!existingStats) {

    await supabase.from("batting_stats").insert({
      match_id: currentMatch.id,
      player_id: originalStrikerId,
      runs: extraRuns,
      balls: 0, //  no ball doesn't count as ball
      fours: extraRuns === 4 ? 1 : 0,
      sixes: extraRuns === 6 ? 1 : 0,
      user_id: user.id
    });

  } else {

    await supabase
      .from("batting_stats")
      .update({
        runs: existingStats.runs + extraRuns,
        fours: extraRuns === 4 ? existingStats.fours + 1 : existingStats.fours,
        sixes: extraRuns === 6 ? existingStats.sixes + 1 : existingStats.sixes
      })
      .eq("id", existingStats.id)
      .eq("user_id" , user.id);
  }
}

    // updating bowler stats
    const bowlerId = innings.bowler_id;

const { data: bowlerStats } = await supabase
  .from("bowling_stats")
  .select("*")
  .eq("match_id", currentMatch.id)
  .eq("player_id", bowlerId)
  .eq("user_id" , user.id)
  .maybeSingle();

if (!bowlerStats) {
  await supabase.from("bowling_stats").insert({
    match_id: currentMatch.id,
    player_id: bowlerId,
    runs: totalRuns,
    user_id: user.id
  });
} else {
  await supabase
    .from("bowling_stats")
    .update({
      runs: bowlerStats.runs + totalRuns
    })
    .eq("id", bowlerStats.id)
    .eq("user_id" , user.id);
}
};

// End Innings 
async function endInnings() {
  if (!innings) return;

  const user = await getCurrentUser();
  // mark current innings completed
  const { error } = await supabase
    .from("match_innings")
    .update({
      is_completed: true
    })
    .eq("id", innings.id)
    .eq("user_id" , user.id);

  if (error) {
    console.log(error);
    toast.error("Failed to end innings");
    return;
  }

   // first innings
  if (currentMatch.currentInnings === 1) {

    const target = (innings.runs || 0) + 1;

    await supabase
      .from("matches")
      .update({
        currentInnings: 2,
        target: target
      })
      .eq("id", currentMatch.id)
      .eq("user_id", user.id);

    toast.success("2nd innings started");

  } 
// 2nd innings
  else {
    toast.success("Match completed. Finishing...");
    await finishMatch();
  }


  //refresh match state
  const updatedMatches = await getMatches();
  dispatch({ type: "SET_MATCHES", payload: updatedMatches });

  // reset local innings 
  setInnings(null);
  
}


async function finishMatch() {
  if (!innings || !currentMatch) return;

  if (currentMatch.currentInnings !== 2) {
    toast.error("Match not in 2nd innings");
    return;
  }

  if (currentMatch.isfinished) {
    toast.error("Match already finished");
    return;
  }

  const battingTeamId = innings.batting_team_id;
  const bowlingTeamId = innings.bowling_team_id;

  const runs = innings.runs || 0;
  const wickets = innings.wickets || 0;
  const target = currentMatch.target;

  let winnerTeamId = null;
  let resultText = "";

  // chasing team wins
  if (runs >= target) {
    winnerTeamId = battingTeamId;
    const wicketsLeft = 10 - wickets;

    resultText = `won by ${wicketsLeft} wickets`;
  } 
  // defending team wins
  else {
    winnerTeamId = bowlingTeamId;
    const runsShort = target - runs - 1;

    resultText = `won by ${runsShort} runs`;
  }

  // update DB
  const user = await getCurrentUser();
  const { error } = await supabase
    .from("matches")
    .update({
      isfinished: true,
      winner_team_id: winnerTeamId,
      result_text: resultText
    })
    .eq("id", currentMatch.id)
    .eq("user_id" , user.id);

  if (error) {
    console.log(error);
    toast.error("Failed to finish match");
    return;
  }

  toast.success("Match Finished");

  // refresh matches
  const updatedMatches = await getMatches();
  dispatch({ type: "SET_MATCHES", payload: updatedMatches });

}


    return (

      <div className="w-full min-h-screen px-3 sm:px-6 md:px-12 py-6 sm:py-8 bg-gray-50">
        <div className='left-5 top-5 absolute cursor-pointer' 
                        onClick={()=> {navigate(-1)}}>
                        <MdArrowBackIosNew/>
          </div>

        {/*WINNER BANNER */}
      {currentMatch.isfinished && (
    <div className="bg-green-600 text-white p-4 rounded mb-4 text-center font-bold">

      {state.teams.find(t => t.id === currentMatch.winner_team_id)?.team_name}

      {" "}
      {currentMatch.result_text}

    </div>
      )}


        {/* Header */}
        <div className="mb-6">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold capitalize text-center mb-5">
            {teamA?.team_name}
            <div className="mx-4 sm:mx-12 md:mx-24">vs</div>
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
          <h2 className="text-lg font-semibold capitalize">{battingTeam?.team_name} - {currentInnings?.runs ?? 0}/{currentInnings?.wickets ?? 0} ({overDisplay})</h2>
          {
            currentMatch.currentInnings === 2 && 
            (<p className="text-gray-500 mt-1">Target: {currentMatch.target}</p>)
            }
        </div>

        {/* Batting + Bowling */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 mb-10">

          {/* Batting */}
          <div className="bg-white border rounded-lg p-4 sm:p-5">
            <h3 className="text-base sm:text-lg font-semibold mb-4 capitalize">Batting — {battingTeam?.team_name}</h3>

            <div className="border-b pb-2 flex text-sm font-medium text-gray-600">
              <span className="w-1/2 text-xs sm:text-sm">Batsman</span>
              <div className="flex w-1/2 text-center text-xs sm:text-sm">
                <span className="w-full">R</span>
                <span className="w-full">B</span>
                <span className="w-full">4s</span>
                <span className="w-full">6s</span>
                <span className="w-full">SR</span>
              </div>
            </div>

            {battingTeamPlayers.map((p) => {

              const stats = battingStats.find(s => s.player_id === p.id) || {};
              const isOut = dismissedPlayers.includes(p.id);

              return (
                <div
                key={p.id}
                className={`py-3 flex border-b last:border-none ${
                   !isOut && innings.striker_id === p.id
                  ? "bg-blue-300"
                  : !isOut && innings.non_striker_id === p.id
                  ? "bg-blue-200"
                  : ""
                }`}>
                  
                <span className="w-1/2">
                  {p.player_name}   
                  
                  {!isOut && innings.striker_id === p.id && " *"}

                   {isOut && (
                  <span className="text-red-500 ml-2 font-bold">
                    (OUT)
                  </span>
                )}
                </span>

                <div className="flex w-1/2 text-center">
                <span className="w-full">{stats.runs || 0}</span>
                <span className="w-full">{stats.balls || 0}</span>
                <span className="w-full">{stats.fours || 0}</span>
                <span className="w-full">{stats.sixes || 0}</span>
                <span className="w-full">{stats.balls ? ((stats.runs / stats.balls)* 100).toFixed(1) : 0}</span>
                </div>
              </div>
              )
            })}
          </div>

          {/* Bowling */}
          <div className="bg-white border rounded-lg p-4 sm:p-5">
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

              const stats = bowlingStats.find(s => s.player_id === b.id) || {};

              // over calculations 
              const balls = stats.balls || 0;
              const overs = `${Math.floor(balls / 6)}.${balls % 6}`;

              //economy rate 
              const economy = balls > 0
              ? (stats.runs / (balls / 6)).toFixed(1)
              : 0;

                return (
              
              <div
                key={b.id}
                className={`py-3 flex border-b last:border-none cursor-pointer
                ${innings?.bowler_id === b.id ? "bg-blue-200" : ""}`}

                onClick={() => selectBowler(b.id)}
                >
                <span className="w-1/2">{b.player_name}</span>

                <div className="flex w-1/2 text-center">
                <span className="w-full">{overs}</span>
                <span className="w-full">{stats.runs || 0}</span>
                <span className="w-full">{stats.wickets || 0}</span>
                <span className="w-full">{economy}</span>
                </div>
                </div>
                )} )
                }
          </div>
        </div>

        {/* runs needed and required run rate */}

              {currentMatch.currentInnings === 2 && !currentMatch.isfinished && (

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
          <div className="flex gap-2 sm:gap-3 flex-wrap">
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
        <div className="flex flex-wrap gap-3 mb-8">
        
            <button
              className="px-4 py-2 border rounded bg-white
                        hover:bg-gray-900 hover:text-white
                        transition-colors duration-200"

              onClick={() => addWide()}
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
                    addNoBall(r);               
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
          onClick={() => 
          setShowWicketMenu(prev => !prev)}
          className="px-4 py-2 border rounded bg-white hover:bg-gray-900 hover:text-white"
        >
          Wicket
        </button>

        {showWicketMenu && (
          <div className="absolute mt-2 bg-white border rounded shadow p-2 flex flex-col gap-2">

            <button
              onClick={() => {   
                
                // if (currentMatch.isFinished) {
                //       toast.error("Match Finished");
                //       return;
                //     }

                // const maxBalls = currentMatch.overs * 6;

                // if (currentInnings.balls >= maxBalls) {
                //   toast.error("Overs Completed");
                //   return;
                // }

                // if (currentInnings.isCompleted) {
                //   toast.error("Innings Completed");
                //   return;
                // }

                // if (!currentInnings.striker_id) {
                //   toast.error("No striker available");
                //   return;
                // }

                // if (!currentInnings.bowler_id) {
                //   toast.error("Select a bowler first");
                //   return;
                // }

                addWicket("striker");
              
                setShowWicketMenu(false);
              }}
              className="hover:bg-gray-100 px-3 py-1 rounded"
            >
              Striker Out
            </button>

            <button
              onClick={() => {

                // if (currentMatch.isFinished) {
                //       toast.error("Match Finished");
                //       return;
                //     }
                    
                //     const maxBalls = currentMatch.overs * 6;

                // if (currentInnings.balls >= maxBalls) {
                //   toast.error("Overs Completed");
                //   return;
                // }

                // if (currentInnings.isCompleted) {
                //   toast.error("Innings Completed");
                //   return;
                // }

                // if (!currentInnings.striker_id) {
                //   toast.error("No striker available");
                //   return;
                // }

                // if (!currentInnings.bowler_id) {
                //   toast.error("Select a bowler first");
                //   return;
                // }

                addWicket("non-striker");
              
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
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-md
                      hover:bg-blue-700 transition-colors duration-200"

          onClick={() => endInnings()}
          >
            End Innings
          </button>

          <button
            className="px-6 py-2 bg-red-600 text-white rounded-md
                      hover:bg-red-700 transition-colors duration-200"

            onClick={() => {
              if (!currentMatch.isfinished) {
                toast.error("Match not finished yet");
                return;
              }

              navigate("/match-summary");

            }}
          >
            Finish Match
          </button>

          <button
            className="px-6 py-2 bg-green-700 text-white rounded-md
                      hover:bg-green-800 transition-colors duration-200"

            onClick={() => {
              if (!currentMatch.isfinished) {
                toast.error("Match not finished yet");
                return;
              }

              navigate("/match-summary");

            }}
          >
            Match Summary
          </button>
        </div>

      </div>
    );
  };

  export default LiveScore;
