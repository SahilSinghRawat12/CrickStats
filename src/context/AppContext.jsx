import { createContext, useReducer } from "react";

export const AppContext = createContext();

export default function AppContextProvider({children})
{

  const initialState = {
        teams: [],
        players: [],
        matches: [],
        currentMatch: null,
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
                         isCaptain: action.payload.isCaptain
                    }
                ]
            };

            case "REMOVE_PLAYER" : return {
                ...state,

                players: state.players.filter( (p)=> p.id !== action.payload)
                
            };

            case "CREATE_MATCH" : return  {
                ...state,
                matches: [
                    ...state.matches,
                    {
                        id: Date.now(),     //unique match id
                        teamAId: action.payload.teamAId,
                        teamBId: action.payload.teamBId,
                        overs: Number(action.payload.overs),
                        date: action.payload.date,
                        tossWinnerId: action.payload.tossWinnerId,
                        tossDecision: action.payload.tossDecision

                    }
                ]
            };
                
            case "SET_CURRENT_MATCH" : return {
                ...state,
                currentMatchId: action.payload
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
