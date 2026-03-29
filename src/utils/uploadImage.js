import { supabase } from "../lib/supabaseCleint";

export const uploadImage = async (file, folder) => {
  const fileName = `${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from("images")
    .upload(`${folder}/${fileName}`, file);

  if (error) {
    console.log(error);
    return null;
  }

  const { data } = supabase.storage
    .from("images")
    .getPublicUrl(`${folder}/${fileName}`);

  return data.publicUrl;
};