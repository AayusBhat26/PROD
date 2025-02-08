import { redirectToSignIn } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { currentProfile } from "@/lib/current-profile";
import { ChannelIdPageClient } from "./channel-id-client";

interface ChannelIdPageProps {
      params: {
            hubsId: string;
            channelId: string;
      }
}

const ChannelIdPage = async ({
      params
}: ChannelIdPageProps) => {
      const profile = await currentProfile();
      if (!profile) return redirectToSignIn();

      const channel = await db.channel.findUnique({
            where: {
                  id: params.channelId
            }
      });

      const member = await db.member.findFirst({
            where: {
                  serverId: params.hubsId,
                  profileId: profile.id
            }
      });

      if (!channel || !member) {
            redirect('/');
      }

      return (
            <ChannelIdPageClient 
                  channel={channel}
                  member={member}
                  params={params}
            />
      );
}

export default ChannelIdPage;