import {v4 as uuidv4} from "uuid"
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";
export  async function POST(req:Request){
      try {
            const {name, imageUrl} = await req.json();
            const profile = await currentProfile(); // created a utility file for the same in the lib folder.

            if(!profile){
                  return new NextResponse("Unauthorized", {status:401});
            }

            // if there is a profile.  then create a server.

            const server = await db.server.create({
                  data:{
                        profileId:profile.id,
                        name:name, 
                        imageUrl:imageUrl,
                        inviteCode: uuidv4(),
                        channels:{
                              create:[
                                    // default channels, and linking to the user which created the channel.
                                    {
                                          name:"general", profileId:profile.id,
                                    }
                              ]
                        }, 
                        members:{
                              create:[
                                    // initial member would be the creator of the hub that would be the admin also.
                                    {profileId:profile.id,role:MemberRole.ADMIN}
                              ]
                        }
                  }
            })
            return NextResponse.json(server);
      } catch (error) {
            console.log("[HUB_API_ROUTE]", error);
            return new NextResponse("Internal Error", {
                  status:500
            })
            
      }
}