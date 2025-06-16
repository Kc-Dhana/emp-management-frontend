import { createClient } from "@supabase/supabase-js";

const superbaseUrl =import.meta.env.VITE_URL;       
const superbaseKey =import.meta.env.VITE_ANON;
export const supabase = createClient(superbaseUrl, superbaseKey);   //superbase eke connetion eke 


export function upploadMediaToSupabase(file) {     
    if (!file) {  
      console.log("No file selected.");
      return;
    }
                                            //ena file eka superpbase upload karalanwa
    return supabase.storage
    .from( 'images' )              //superbase bucket name
    .upload(file.name,file, {           //upload karana file eke name ekema gannnwa
      cacheControl: '3600',
      upsert: false
    })
}