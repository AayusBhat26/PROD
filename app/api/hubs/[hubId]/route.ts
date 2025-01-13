import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
      req: Request,
      { params }: {
            params: {
                  hubId: string
            }
      }
) {
      try {
            const profile = await currentProfile();
            if (!profile) {
                  return new NextResponse("user not authenicated", { status: 401 })
            }
            const server = await db.server.delete({
                  where: {
                        id: params.hubId,
                        // only the admin can modify the profile.
                        profileId: profile.id
                  },
                  
            })
            return NextResponse.json(server);
      } catch (error) {
            console.log('[inside the server id delete]', error);
            return new NextResponse("internal server error", { status: 500 })

      }
}

// patch function for channging the settings of server/
export async function PATCH(
      req: Request,
      { params }: {
            params: {
                  hubId: string
            }
      }
) {
      try {
            const profile = await currentProfile();
            // whenever a request is made, it might be added with the new url of the image (uploadthing) and the updated name of the hub, 
            // therefore destructing the required data from request.
            const {name, imageUrl}= await req.json();
            if(!profile){
                  return new NextResponse("user not authenicated", {status:401})
            }
            const server =await db.server.update({
                  where:{
                        id: params.hubId, 
                        // only the admin can modify the profile.
                        profileId: profile.id
                  }, 
                  data:{
                        name, imageUrl
                  }
            })
            return  NextResponse.json(server);
      } catch (error) {
            console.log('[isnide the server id patch]', error);
            return new NextResponse("internal server error", {status:500})
            
      }
}

