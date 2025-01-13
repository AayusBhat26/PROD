import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server"

export async function POST(
      req:Request
){
      try {
            const profile = await currentProfile();
            const {name, type}= await req.json();
            const {searchParams} = new URL(req.url);
            
            const serverId = searchParams.get("serverId");
            console.log( searchParams);
            
            if(!profile) return new NextResponse('Unauthenticated user', {status:401});
            if(!serverId) return new NextResponse(' Server not found', {
                  status:400,
            })  
            // checking whether the user has bypassed the frontend validation and tried to create a new sub hub with the name common chat
            if(name==='Common Chat') return new NextResponse("Name cannot be 'Common Chat'", {status:400});
            const server = await db.server.update({
                  where:{
                        id:serverId, 
                        members:{
                              some:{
                                    profileId: profile.id, 
                                    role:{
                                          in:[MemberRole.ADMIN, MemberRole.MODERATOR]
                                    }
                              }
                        }
                  }, 
                  data:{
                        channels:{
                              create:{
                                    profileId:profile.id, name, type
                              }
                        }
                  }
            })
            return NextResponse.json(server);
      } catch (error) {
            console.log('channel post', error)
            return new NextResponse('Internal Server Error', {
                  status:500
            })
      }
}