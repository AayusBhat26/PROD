import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
      req:Request, 
      {params} : {params:{hubId: string}}
){
      try {
            // current profile.
            const profile = await currentProfile();
            if(!profile) {
                  return new NextResponse('User not found or unauthenticated user', { status: 401 });
            }
            if(!params.hubId){
                  return new NextResponse('Server not found or missing', {status:400});
            }
            const server = await db.server.update({
                  where:{
                        id: params.hubId,
                        profileId:{
                              not:profile.id
                        },
                          members: {
                              some:{
                                    profileId:profile.id
                              }
                        }, 
                  },
                
                  data:{
                        members:{
                              deleteMany:{
                                    profileId:profile.id
                              }
                        }
                  }
            })
            return NextResponse.json(server);
      } catch (error) {
            console.log("Inside /leave route", error);
            return new NextResponse('Error in /leave route, Internal Server Error', {status:500})
      }
}