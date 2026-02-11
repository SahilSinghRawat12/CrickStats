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
            
            const tossWinnerId = action.payload.tossWinnerId

            const tossLoserId =
                 tossWinnerId === action.payload.teamAId
                 ? action.payload.teamBId
                 : action.payload.teamBId;

            const battingTeamId = 
             action.payload.tossDecision === "Bat"
             ? tossWinnerId
             : tossLoserId;

             const bowlingTeamId = 
              action.payload.tossDecision === "Bat"
              ? tossLoserId
              : tossWinnerId;            
            
            return  {
                ...state,
                matches: [
                    ...state.matches,
                    {
                        id: Date.now(),     //unique match id
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
                                strikerId: null,
                                nonStrikerId: null,
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

                // 3. Increase score and balls
                const updatedInnings = {
                ...innings,
                runs: innings.runs + runs,
                balls: innings.balls + 1
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
