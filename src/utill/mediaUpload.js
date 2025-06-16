// import app from "../config/firebase";
// import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { createClient } from "@supabase/supabase-js";
// import { cache } from "react";

// const storage = getStorage(app, "gs://hotel-managment-99.appspot.com"); //cutomer bucket url. storage eke file

const superbaseUrl =import.meta.env.VITE_URL;       
const superbaseKey =import.meta.env.VITE_ANON;
export const supabase = createClient(superbaseUrl, superbaseKey);   //superbase eke connetion eke 

// export default function uploadMedia(file) {
//     if (!file) {
//       console.log("No file selected.");
//       return;
//     }
  
//     const fileRef = ref(storage, file.name);
  
//     return uploadBytes(fileRef, file)//promise eka return karawna
//   }

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