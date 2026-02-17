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

                // 1. Update only the active match
                if (match.id !== state.currentMatchId) return match;

                // 2. Find which innings is active
                const inningsIndex = match.currentInnings - 1;
                const innings = match.innings[inningsIndex];

                
                // ❗ Stop scoring if no bowler selected
                if (!innings.bowlerId) return match;

                const strikerId = innings.strikerId;

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
                let newStrikerId = innings.strikerId;
                let newNonStrikerId = innings.nonStrikerId;

                const newBallForOver = innings.balls + 1;
                // const oversCompleted = Math.floor(newBallForOver / 6);
                // const ballsInOver = newBallForOver % 6;

                if(runs === 1 || runs === 3)
                {
                    newStrikerId = innings.nonStrikerId;
                    newNonStrikerId = innings.strikerId;
                }

                if(newBallForOver % 6 === 0)
                {
                    newStrikerId = innings.nonStrikerId;
                    newNonStrikerId = innings.strikerId;
                }


                // ---- UPDATE INNINGS ----
                // 3. Increase score and balls
                const updatedInnings = {
                ...innings,
                runs: innings.runs + runs,
                balls: newBallForOver,
                // oversCompleted,
                // ballsInOver,
                strikerId: newStrikerId,
                nonStrikerId: newNonStrikerId,
                battingStats: updatedBattingStats,
                 bowlingStats: updatedBowlingStats
                };

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
                    if(match.id !== state.currentMatchId) return match;

                    const inningsIndex = match.currentInnings - 1;
                    const innings = match.innings[inningsIndex];

                    const nextPlayerId = innings.battingOrder[innings.nextBatsmanIndex];

                    let newStrikerId = innings.strikerId;
                    let newNonStrikerId = innings.nonStrikerId;

                    if(outPlayerId === newStrikerId)
                    {
                        newStrikerId = nextPlayerId;
                    } else {
                        newNonStrikerId = nextPlayerId;
                    }

                    const updatedInnings = {
                    ...innings,
                    wickets: innings.wickets + 1,
                    strikerId: newStrikerId,
                    nonStrikerId: newNonStrikerId,
                    nextBatsmanIndex: innings.nextBatsmanIndex + 1,
                    dismissedPlayers: [...innings.dismissedPlayers, outPlayerId]
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
