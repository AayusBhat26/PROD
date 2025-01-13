import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { Noto_Sans_Tamil_Supplement } from "next/font/google";
import { redirect } from "next/navigation";

interface InviteCodePageProps{
      params:{
            inviteCode:string
      }
};


const InviteCodePage = async ({
      params
}: InviteCodePageProps) => {
      const profile = await currentProfile();
      if(!profile) {
            return redirectToSignIn();
      }
      if(!params.inviteCode){
            return redirect("/");
      }
      const exisitingServer = await db.server.findFirst({
            where:{
                  inviteCode: params.inviteCode, 
                  members:{
                        some:{
                              profileId:profile.id
                        }
                  }
            }
      })
      if(exisitingServer){
            return redirect(`/hubs/${exisitingServer.id}`);
      }
      const server = await db.server.update({
            where:{
                  inviteCode: params.inviteCode,
            }, 
            data:{
                  members:{
                        create:[
                              {profileId: profile.id}
                        ]
                  }
            }
      })
      if(server){
            return redirect(`/hubs/${server.id}`)
      }
      return null;
}
 
export default InviteCodePage;