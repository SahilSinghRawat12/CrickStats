import { createContext, useReducer } from "react";

export const AppContext = createContext();

export default function AppContextProvider({children})
{

  const initialState = {
        teams: [],
        matches: [],
        currentMatch: null,
        stats : {
            totalRuns: 0,
            totalMatches: 0
        }
    };

    const reducer = (state , action) => {
        switch (action.type) {

            case "ADD_TEAM": return {
                ...state,
                
                teams: [
                    ...state.teams,
                    {
                        id: state.teams.length + 1,
                        teamName: action.payload.teamName,
                        totalPlayers: action.payload.totalPlayers
                    }
                ]
                
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
