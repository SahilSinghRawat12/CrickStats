import { createContext } from "react";
import { supabase } from "../lib/supabaseCleint";

export const FetchContext = createContext();

export const FetchContextProvider = ({ children }) => {

    // GET TEAMS 
     const getTeams = async () => {
    const { data, error } = await supabase
      .from("teams")
      .select("*");

    if (error) {
      console.error(error);
      return [];
    }

    return data;
  };

   // GET PLAYERS
  const getPlayers = async () => {
    const { data, error } = await supabase
      .from("players")
      .select("*");

    if (error) {
      console.error(error);
      return [];
    }

    return data;
  };

   // GET MATCHES
  const getMatches = async () => {
    const { data, error } = await supabase
      .from("matches")
      .select("*");

    if (error) {
      console.error(error);
      return [];
    }

    return data;
  };


    // CREATE MATCH
  const createMatch = async (matchData) => {
    const { data, error } = await supabase
      .from("matches")
      .insert([matchData])
      .select()
      .single();

    if (error) {
      console.error(error);
      return null;
    }

    return data;
  };

   // CREATE PLAYER
  const createPlayer = async (playerData) => {
    const { data, error } = await supabase
      .from("players")
      .insert([playerData])
      .select()
      .single();

    if (error) {
      console.error(error);
      return null;
    }

    return data;
  };

  const getMatchesWithInnings = async () => {
  const { data, error } = await supabase
    .from("matches")
    .select(`
      *,
      match_innings!match_innings_match_id_fkey(*)
    `);

  if (error) {
    console.log(error);
    return [];
  }

  return data;
};

  return (
    <FetchContext.Provider
      value={{
        getTeams,
        getPlayers,
        getMatches,
        createMatch,
        createPlayer,
        getMatchesWithInnings
      }}
    >
    {children}
    </FetchContext.Provider>
  );
};