import { createContext } from "react";
import { supabase } from "../lib/supabaseCleint";

export const FetchContext = createContext();

export const FetchContextProvider = ({ children }) => {

    // GET TEAMS 
     const getTeams = async () => {
      const {data: userData} = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("teams")
      .select("*")
      .eq("user_id", userData.user.id)
      .order("created_at" , {ascending: true});

    if (error) {
      console.error(error);
      return [];
    }

    return data;
  };

   // GET PLAYERS
  const getPlayers = async () => {
    const {data: userData} = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("players")
      .select("*")
      .eq("user_id", userData.user.id)
      .order("created_at", {ascending: true});

    if (error) {
      console.error(error);
      return [];
    }

    return data;
  };

   // GET MATCHES
  const getMatches = async () => {
    const {data: userData} = await supabase.auth.getUser();
      
    const { data, error } = await supabase
      .from("matches")
      .select("*")
      .eq("user_id", userData.user.id)
      .order("created_at" , {ascending: true});

    if (error) {
      console.error(error);
      return [];
    }

    return data;
  };


    // CREATE MATCH
  const createMatch = async (matchData) => {
    const {data: userData} = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("matches")
      .insert([{
        ...matchData,
       user_id: userData.user.id
      }])
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
     const {data: userData} = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("players")
      .insert([{
        ...playerData,
      user_id: userData.user.id
    }])
      .select()
      .single();

    if (error) {
      console.error(error);
      return null;
    }

    return data;
  };

  const getMatchesWithInnings = async () => {
     const {data: userData} = await supabase.auth.getUser();

     if(!userData?.user)
     {
      console.log("No user found");
      return [];
     }

  const { data, error } = await supabase
    .from("matches")
    .select(`
      *,
      match_innings!match_innings_match_id_fkey(*)
    `)
    .eq("user_id" , userData.user.id);

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