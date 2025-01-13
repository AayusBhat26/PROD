import {auth} from "@clerk/nextjs";
import { db } from "./db";
// returns the current profile of the user if they are logged in.
export const currentProfile = async ()=>{
      const {userId} = auth();
      if(!userId){
            return null;
      }
      const profile = await db.profile.findUnique({
            where:{
                  userId
            }
      })
      return profile;
}