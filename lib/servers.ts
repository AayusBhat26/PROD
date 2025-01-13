import {auth} from "@clerk/nextjs";
import {db} from "./db";
import { currentProfile } from "./current-profile";


export const Servers = async ()=>{
      const profile = await currentProfile();
      const userId = auth();

      if(!userId){
            return null;
      }
      const servers = await db.server.findMany({
            where:{
                  members:{
                        some:{
                              profileId: profile?.id 
                        }
                  }
            }
      })
      return servers;
}