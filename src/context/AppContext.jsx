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
            
            return {
              ...state,               
                teams: [
                    ...state.teams,
                    action.payload
                ],
                currentTeamId: action.payload.id  //set current team
            };

            case "SET_TEAMS": return {
                ...state,
                teams: action.payload
            }

            case "DELETE_TEAM" : 
            return {
                ...state,
                teams: state.teams.filter( team => team.id !== action.payload)
            }

            case "SET_CURRENT_TEAM": return {
                ...state,
                currentTeamId: action.payload
            } 

            case "ADD_PLAYER" : return {
                
                ...state,

                players: [ ...state.players, action.payload ]
            };

            //fetcing player from database
            case "SET_PLAYERS":

                    return {
                    ...state,
                    players: action.payload
                    
              };

            case "REMOVE_PLAYER" : return {
                ...state,

                players: state.players.filter( (p)=> p.id !== action.payload)
                
            };
            

            // case "CREATE_MATCH" : 
            
            // const matchId = Date.now();
            
            // const tossWinnerId = action.payload.tossWinnerId

            // const tossLoserId =
            //      tossWinnerId === action.payload.teamAId
            //      ? action.payload.teamBId
            //      : action.payload.teamAId;

            // const battingTeamId = 
            //  action.payload.tossDecision === "Bat"
            //  ? tossWinnerId
            //  : tossLoserId;

            //  const bowlingTeamId = 
            //   action.payload.tossDecision === "Bat"
            //   ? tossLoserId
            //   : tossWinnerId;     
              
            //   const battingPlayers = state.players.filter(p => p.teamId === battingTeamId);
            //   const battingOrder = battingPlayers.map(p => p.id);
            
            // return  {
            //     ...state,
            //     matches: [
            //         ...state.matches,
            //         {
            //             id: matchId,     //unique match id
            //             teamAId: action.payload.teamAId,
            //             teamBId: action.payload.teamBId,
            //             overs: Number(action.payload.overs),
            //             date: action.payload.date,
            //             tossWinnerId ,
            //             tossDecision: action.payload.tossDecision,

            //         }
            //     ]
            // };


 case "CREATE_MATCH":

  return {
    ...state,
    matches: [
      ...state.matches,
      {
        id: action.payload.id,   // use DB id
        team_a_id: action.payload.team_a_id,
        team_b_id: action.payload.team_b_id,
        overs: Number(action.payload.overs),
        date: action.payload.date,

        toss_winner_id: action.payload.toss_winner_id,
        toss_decision: action.payload.toss_decision,

        currentInnings: action.payload.currentInnings || 1,    
        isfinished: action.payload.isfinished || false,     
        target: action.payload.target || null           
      }
    ]
  };

             case "SET_MATCHES":

                return {
                ...state,
                matches: action.payload.map( m => ({
                    ...m,
                    currentInnings: m.currentInnings || 1,
                    isfinished: m.isfinished || false
                }))
                };
                
                
            case "SET_CURRENT_MATCH" : 
            
            localStorage.setItem("currentMatchId" , action.payload);

            return {
                ...state,
                currentMatchId: action.payload
            }
                
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
