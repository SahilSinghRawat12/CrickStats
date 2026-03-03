import { createContext, useReducer } from "react";

export const AppContext = createContext();

export default function AppContextProvider({children})
{

  const initialState = {
        teams: [],
        players: [],
        matches: [],
         currentTeamId: null,
        currentMatchId: null,
        stats : {
            totalRuns: 0,
            totalMatches: 0
        }
    };

    const reducer = (state , action) => {
        switch (action.type) {

            case "ADD_TEAM":
            
              const newTeam = {
                     id: Date.now(), 
                    teamName: action.payload.teamName
                    // totalPlayers: action.payload.totalPlayers
                };
                
            
            return {

              ...state,               
                teams: [
                    ...state.teams,
                     newTeam,
                ],
                currentTeamId: newTeam.id  //set current team
            };

            case "SET_CURRENT_TEAM": return {
                ...state,
                currentTeamId: action.payload
            } 

            case "ADD_PLAYER" : return {
                
                ...state,

                players: [
                    ...state.players, 
                    {
                         id: Date.now(),
                         playerName: action.payload.playerName,
                         playerRole: action.payload.playerRole,
                         isCaptain: action.payload.isCaptain,
                         teamId: state.currentTeamId
                    }
                ]
            };

            case "REMOVE_PLAYER" : return {
                ...state,

                players: state.players.filter( (p)=> p.id !== action.payload)
                
            };

            case "CREATE_MATCH" : 
            
            const matchId = Date.now();
            
            const tossWinnerId = action.payload.tossWinnerId

            const tossLoserId =
                 tossWinnerId === action.payload.teamAId
                 ? action.payload.teamBId
                 : action.payload.teamAId;

            const battingTeamId = 
             action.payload.tossDecision === "Bat"
             ? tossWinnerId
             : tossLoserId;

             const bowlingTeamId = 
              action.payload.tossDecision === "Bat"
              ? tossLoserId
              : tossWinnerId;     
              
              const battingPlayers = state.players.filter(p => p.teamId === battingTeamId);
              const battingOrder = battingPlayers.map(p => p.id);
            
            return  {
                ...state,
                matches: [
                    ...state.matches,
                    {
                        id: matchId,     //unique match id
                        teamAId: action.payload.teamAId,
                        teamBId: action.payload.teamBId,
                        overs: Number(action.payload.overs),
                        date: action.payload.date,
                        tossWinnerId ,
                        tossDecision: action.payload.tossDecision,

                        currentInnings : 1,

                        innings: [
                            {
                                battingTeamId,
                                bowlingTeamId,
                                
                                runs: 0,
                                wickets: 0,
                                
                                balls: 0,
                                oversCompleted: 0,
                                ballsInOver: 0,
                                
                                strikerId: battingOrder[0],
                                nonStrikerId: battingOrder[1],

                                battingOrder,
                                nextBatsmanIndex: 2,
                                dismissedPlayers: [],

                                bowlerId: null,
                                battingStats: {},
                                bowlingStats: {}
                            }
                        ]

                    }
                ]
            };
                
            case "SET_CURRENT_MATCH" : return {
                ...state,
                currentMatchId: action.payload
            }

            case "ADD_RUN": {
                
            const { runs } = action.payload;

            const matches = state.matches.map(match => {

                // if (!innings.strikerId) return match;

                // 1. Update only the active match
                if (match.id !== state.currentMatchId) return match;

                // 2. Find which innings is active
                const inningsIndex = match.currentInnings - 1;
                const innings = match.innings[inningsIndex];

                // STOP if innings already completed
                    if (innings.isCompleted) {
                        return match;
                    }

                // stop if over finished
                const maxBalls = match.overs * 6;

                if (innings.balls >= maxBalls) {
                    return match; // stop scoring after match overs finished
                }
      
                // ❗ Stop scoring if no bowler selected
                if (!innings.bowlerId) return match;

                const strikerId = innings.strikerId;

                if (innings.dismissedPlayers.includes(strikerId)) {
                        return match;
                    }

                // ---- BATSMAN STATS ----
                const strikerStats = innings.battingStats[strikerId] || {
                    runs: 0,
                    balls: 0,
                    fours: 0,
                    sixes: 0,
                    sr: 0
                };

                const newRuns = strikerStats.runs + runs;
                const newBalls = strikerStats.balls + 1;
                
                const  updatedStrikerStats = {
                    ...strikerStats,
                    runs: newRuns,
                    balls: newBalls,
                    fours: runs === 4 ? strikerStats.fours + 1 : strikerStats.fours,
                    sixes: runs === 6 ? strikerStats.sixes + 1 : strikerStats.sixes,
                    sr: ((newRuns / newBalls) * 100).toFixed(2)
                };

                const updatedBattingStats = {
                    ...innings.battingStats,
                    [strikerId]: updatedStrikerStats
                };


                //---- BOWLER STATS ----
                const bowlerId = innings.bowlerId;

                const bowlerStats = innings.bowlingStats[bowlerId] || {
                runs: 0,
                balls: 0,
                wickets: 0,
                // overs: 0,
                er: 0
                };

                const newBowlerBalls = bowlerStats.balls + 1;
                const newBowlerRuns = bowlerStats.runs + runs;

                const updatedBowlerStats = {
                ...bowlerStats,
                runs: newBowlerRuns,
                balls: newBowlerBalls,
                // overs: Math.floor(newBowlerBalls / 6),
                er: newBowlerBalls > 0
                        ? (newBowlerRuns / (newBowlerBalls / 6)).toFixed(2)
                        : 0
                };

                const updatedBowlingStats = {
                ...innings.bowlingStats,
                [bowlerId]: updatedBowlerStats
                };


                // ---- STRIKE CHANGE ----
                
                const newBallForOver = innings.balls + 1;
                const ballsInOver = newBallForOver % 6;
                const oversCompleted = Math.floor(newBallForOver / 6);

                // if (oversCompleted >= match.overs) {
                //     return match;
                // }

                let newStrikerId = innings.strikerId;
                let newNonStrikerId = innings.nonStrikerId;


                let newBowlerId = innings.bowlerId;

                // if over completed → force selecting new bowler
                // change strike only if 2 different players exist
                    if (
                    (runs === 1 || runs === 3) &&
                    newStrikerId !== newNonStrikerId
                    ) {
                    const temp = newStrikerId;
                    newStrikerId = newNonStrikerId;
                    newNonStrikerId = temp;
                    }

               // END OF OVER STRIKE CHANGE
                    if (ballsInOver === 0) {

                        // swap only if two different batsmen exist
                        if (newStrikerId !== newNonStrikerId) {
                            const temp = newStrikerId;
                            newStrikerId = newNonStrikerId;
                            newNonStrikerId = temp;
                        }

                        // force selecting new bowler for next over
                        newBowlerId = null;
                    }

                // if(newBallForOver % 6 === 0)
                // {
                //     newStrikerId = innings.nonStrikerId;
                //     newNonStrikerId = innings.strikerId;
                // }


                // ---- UPDATE INNINGS ----
                // 3. Increase score and balls
                const updatedInnings = {
                ...innings,
                runs: innings.runs + runs,
                balls: newBallForOver,
                ballsInOver,
                oversCompleted,
                strikerId: newStrikerId,
                nonStrikerId: newNonStrikerId,
                bowlerId: newBowlerId, 
                battingStats: updatedBattingStats,
                 bowlingStats: updatedBowlingStats
                };

                // ⭐ TARGET CHASE LOGIC
                    if (
                    match.currentInnings === 2 &&
                    updatedInnings.runs >= match.target
                    ) {

                    const updatedInningsList = [...match.innings];
                    updatedInningsList[inningsIndex] = {
                        ...updatedInnings,
                        isCompleted: true
                    };

                    return {
                        ...match,
                        innings: updatedInningsList,
                        isFinished: true,
                        winnerTeamId: innings.battingTeamId
                    };
                    }

                // 4. Put updated innings back into innings array
                const updatedInningsList = [...match.innings];
                updatedInningsList[inningsIndex] = updatedInnings;

                // 5. Return updated match
                return {
                ...match,
                innings: updatedInningsList
                };
            });

            // 6. Return updated state
            return {
                ...state,
                matches
            };
            }


            case 'ADD_WICKET' : {

                const {outPlayerId} = action.payload;

                const matches = state.matches.map(match => {

                    // if (innings.isCompleted) return match;

                    // const maxBalls = match.overs * 6;
                    // if (innings.balls >= maxBalls) return match;

                    if(match.id !== state.currentMatchId) return match;

                    const inningsIndex = match.currentInnings - 1;
                    const innings = match.innings[inningsIndex];

                    if (!innings.bowlerId) return match;

                    const nextPlayerId = innings.battingOrder[innings.nextBatsmanIndex] || null;

                    let newStrikerId = innings.strikerId;
                    let newNonStrikerId = innings.nonStrikerId;

                    const totalPlayers = innings.battingOrder.length;
                    const wicketsAfterThisBall = innings.wickets + 1;

                    const noBatsmanLeft =
                    wicketsAfterThisBall >= totalPlayers - 1;

                    // 🧠 LAST BATSMAN OUT → END INNINGS
                    if (noBatsmanLeft) {

                    const updatedInnings = {
                        ...innings,
                        wickets: innings.wickets + 1,
                        dismissedPlayers: [
                        ...innings.dismissedPlayers,
                        outPlayerId
                        ],
                        isCompleted: true
                    };

                    const updatedInningsList = [...match.innings];
                    updatedInningsList[inningsIndex] = updatedInnings;

                    return {
                        ...match,
                        innings: updatedInningsList
                    };
                    }

                  // ⭐ STRIKER OUT
                    if (outPlayerId === innings.strikerId) {

                    if (nextPlayerId) {
                        // normal case
                        newStrikerId = nextPlayerId;
                    } else {
                        // no batsman left → non striker plays alone
                        newStrikerId = innings.nonStrikerId;
                        newNonStrikerId = innings.nonStrikerId;
                    }

                    }
                    // ⭐ NON STRIKER OUT
                    else {

                    if (nextPlayerId) {
                        newNonStrikerId = nextPlayerId;
                    } else {
                        // striker plays alone
                        newNonStrikerId = innings.strikerId;
                    }

                    }


                    // bowling wicket stats 
                    const bowlerId = innings.bowlerId;

                    const bowlerStats = innings.bowlingStats[bowlerId] || {
                    runs: 0,
                    balls: 0,
                    wickets: 0,
                    er: 0
                    };

                    const updatedBowlingStats = {
                    ...innings.bowlingStats,
                    [bowlerId]: {
                        ...bowlerStats,
                        wickets: bowlerStats.wickets + 1
                    }
                    };

                    // updated innings 
                    const updatedInnings = {
                    ...innings,
                    wickets: innings.wickets + 1,
                    strikerId: newStrikerId,
                    nonStrikerId: newNonStrikerId,
                    nextBatsmanIndex: innings.nextBatsmanIndex + 1,
                    dismissedPlayers: [...innings.dismissedPlayers, outPlayerId],
                    bowlingStats: updatedBowlingStats
                    };

                    const updatedInningsList = [...match.innings];
                    updatedInningsList[inningsIndex] = updatedInnings;


                    return {
                        ...match,
                        innings: updatedInningsList
                    };

                });

                return {
                    ...state,
                    matches
                };
            }


            case "SET_BOWLER": {

                    const { bowlerId } = action.payload;

                    const matches = state.matches.map(match => {

                        if (match.id !== state.currentMatchId) return match;

                        const inningsIndex = match.currentInnings - 1;
                        const innings = match.innings[inningsIndex];

                        // allow change only if new over (0 balls)
                        if (innings.ballsInOver !== 0) return match;

                        const updatedInnings = {
                        ...innings,
                        bowlerId
                        };

                        const updatedInningsList = [...match.innings];
                        updatedInningsList[inningsIndex] = updatedInnings;

                        return {
                        ...match,
                        innings: updatedInningsList
                        };
                    });

                    return {
                        ...state,
                        matches
                    };
                }

                
                case "END_INNINGS": {

                const matches = state.matches.map(match => {

                    if (match.id !== state.currentMatchId) return match;

                    const inningsIndex = match.currentInnings - 1;
                    const currentInnings = match.innings[inningsIndex];

                    // if already 2 innings → finish match
                    if (match.currentInnings === 2) {
                    return {
                        ...match,
                        isFinished: true
                    };
                    }

                    // -------- CREATE 2ND INNINGS --------

                    const newBattingTeamId = currentInnings.bowlingTeamId;
                    const newBowlingTeamId = currentInnings.battingTeamId;

                    // players for new batting team
                    const battingPlayers = state.players.filter(
                    p => p.teamId === newBattingTeamId
                    );

                    const battingOrder = battingPlayers.map(p => p.id);

                    const secondInnings = {
                    battingTeamId: newBattingTeamId,
                    bowlingTeamId: newBowlingTeamId,

                    runs: 0,
                    wickets: 0,
                    balls: 0,
                    oversCompleted: 0,
                    ballsInOver: 0,

                    strikerId: battingOrder[0] || null,
                    nonStrikerId: battingOrder[1] || null,

                    battingOrder,
                    nextBatsmanIndex: 2,
                    dismissedPlayers: [],

                    bowlerId: null,
                    battingStats: {},
                    bowlingStats: {},

                    // target: currentInnings.runs + 1
                    };

                    return {
                    ...match,
                    currentInnings: match.currentInnings + 1,
                    target: currentInnings.runs + 1,
                    innings: [...match.innings, secondInnings]
                    };
                });

                return {
                    ...state,
                    matches
                };
                }


                case "ADD_WIDE": {

                const matches = state.matches.map(match => {

                    if (match.id !== state.currentMatchId) return match;

                    const inningsIndex = match.currentInnings - 1;
                    const innings = match.innings[inningsIndex];

                    // stop if innings completed
                    if (innings.isCompleted) return match;

                    const maxBalls = match.overs * 6;

                    if (innings.balls >= maxBalls) {
                        return match;
                    }

                    // must select bowler
                    if (!innings.bowlerId) return match;

                    const bowlerId = innings.bowlerId;

                    const bowlerStats = innings.bowlingStats[bowlerId] || {
                    runs: 0,
                    balls: 0,
                    wickets: 0,
                    er: 0
                    };

                    const updatedBowlerStats = {
                    ...bowlerStats,
                    runs: bowlerStats.runs + 1,
                    er:
                        bowlerStats.balls > 0
                        ? ((bowlerStats.runs + 1) / (bowlerStats.balls / 6)).toFixed(2)
                        : 0
                    };

                    const updatedInnings = {
                    ...innings,
                    runs: innings.runs + 1,
                    bowlingStats: {
                        ...innings.bowlingStats,
                        [bowlerId]: updatedBowlerStats
                    }
                    };

                    // ⭐ TARGET CHASE LOGIC
                    if (
                    match.currentInnings === 2 &&
                    updatedInnings.runs >= match.target
                    ) {

                    const updatedInningsList = [...match.innings];
                    updatedInningsList[inningsIndex] = {
                        ...updatedInnings,
                        isCompleted: true
                    };

                    return {
                        ...match,
                        innings: updatedInningsList,
                        isFinished: true,
                        winnerTeamId: innings.battingTeamId
                    };
                    }


                    const updatedInningsList = [...match.innings];
                    updatedInningsList[inningsIndex] = updatedInnings;

                    return { ...match, innings: updatedInningsList };
                });

                return { ...state, matches };
                }


                case "ADD_NO_BALL_RUN": {

                const { runs } = action.payload;

                const matches = state.matches.map(match => {

                    if (match.id !== state.currentMatchId) return match;

                    const inningsIndex = match.currentInnings - 1;
                    const innings = match.innings[inningsIndex];

                    // stop if innings completed
                    if (innings.isCompleted) return match;

                    const maxBalls = match.overs * 6;

                        if (innings.balls >= maxBalls) {
                            return match;
                        }

                    // stop if striker already out
                    if (innings.dismissedPlayers.includes(innings.strikerId)) {
                        return match;
                        }

                    if (!innings.bowlerId) return match;

                    const strikerId = innings.strikerId;
                    const bowlerId = innings.bowlerId;

                    // ---------- BATSMAN ----------
                    const strikerStats = innings.battingStats[strikerId] || {
                    runs: 0,
                    balls: 0,
                    fours: 0,
                    sixes: 0,
                    sr: 0
                    };

                    const newRuns = strikerStats.runs + runs;

                    const updatedStrikerStats = {
                    ...strikerStats,
                    runs: newRuns,
                    fours: runs === 4 ? strikerStats.fours + 1 : strikerStats.fours,
                    sixes: runs === 6 ? strikerStats.sixes + 1 : strikerStats.sixes,
                    sr: strikerStats.balls > 0
                        ? ((newRuns / strikerStats.balls) * 100).toFixed(2)
                        : 0
                    };

                    // ---------- BOWLER ----------
                    const bowlerStats = innings.bowlingStats[bowlerId] || {
                    runs: 0,
                    balls: 0,
                    wickets: 0,
                    er: 0
                    };

                    const totalRuns = runs + 1; // no ball extra

                    const updatedBowlerStats = {
                    ...bowlerStats,
                    runs: bowlerStats.runs + totalRuns,
                    er:
                        bowlerStats.balls > 0
                        ? ((bowlerStats.runs + totalRuns) / (bowlerStats.balls / 6)).toFixed(2)
                        : 0
                    };

                    // ---------- STRIKE CHANGE ----------
                    let newStriker = innings.strikerId;
                    let newNonStriker = innings.nonStrikerId;

                   if (
                    (runs === 1 || runs === 3) &&
                    newStriker !== newNonStriker
                    ) {
                    newStriker = innings.nonStrikerId;
                    newNonStriker = innings.strikerId;
                    }

                    const updatedInnings = {
                    ...innings,
                    runs: innings.runs + totalRuns,
                    strikerId: newStriker,
                    nonStrikerId: newNonStriker,
                    battingStats: {
                        ...innings.battingStats,
                        [strikerId]: updatedStrikerStats
                    },
                    bowlingStats: {
                        ...innings.bowlingStats,
                        [bowlerId]: updatedBowlerStats
                    }
                    };

                    // ⭐ TARGET CHASE LOGIC
                    if (
                    match.currentInnings === 2 &&
                    updatedInnings.runs >= match.target
                    ) {

                    const updatedInningsList = [...match.innings];
                    updatedInningsList[inningsIndex] = {
                        ...updatedInnings,
                        isCompleted: true
                    };

                    return {
                        ...match,
                        innings: updatedInningsList,
                        isFinished: true,
                        winnerTeamId: innings.battingTeamId
                    };
                    }


                    const updatedInningsList = [...match.innings];
                    updatedInningsList[inningsIndex] = updatedInnings;

                    return {
                    ...match,
                    innings: updatedInningsList
                    };
                });

                return { ...state, matches };
                }
                            
        
            default: return state
                
        }
    }

    function init(initialState)
    {
        return initialState;
    }

    const [state , dispatch] = useReducer(reducer , initialState , init);

    const value = {
      state ,
      dispatch  
    };

return <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>

}
