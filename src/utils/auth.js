import {supabase} from "../lib/supabaseCleint"

//sign up

export const signUp = async (email , password) => {
    const {data , error} = await supabase.auth.signUp({
        email,
        password
    });

    return {data , error};
};

//sign in

export const signIn = async (email , password) => {
    const {data , error} = await supabase.auth.signInWithPassword({
        email,
        password
    });

    return {data , error};
};

//sign out
export const signOut = async () => {
    const {error} = await supabase.auth.signOut();
    return {error};
};

//get current user
export const getUser = async () => {
    const {data} = await supabase.auth.getUser();
    return data?.user;
};