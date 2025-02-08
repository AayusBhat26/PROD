// Server Component
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { MediaRoom } from "@/components/vc";
import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { MemberIdPageClient } from "./member-id-client";

interface MemberIdPageProps {
      params: {
            memberId: string,
            hubsId: string,
      },
      searchParams: {
            video?: boolean,
      }
}

const MemberIdPage = async ({ params, searchParams }: MemberIdPageProps) => {
      const profile = await currentProfile();
      if (!profile) return redirectToSignIn();

      const currentMember = await db.member.findFirst({
            where: {
                  serverId: params.hubsId,
                  profileId: profile.id,
            },
            include: {
                  profile: true,
            },
      });

      if (!currentMember) {
            return redirect("/");
      }

      const conversation = await getOrCreateConversation(currentMember.id, params.memberId);
      if (!conversation) return redirect(`/hubs/${params.hubsId}`);

      const { memberOne, memberTwo } = conversation;
      const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne;

      return (
            <MemberIdPageClient 
                  currentMember={currentMember}
                  otherMember={otherMember}
                  conversation={conversation}
                  params={params}
                  searchParams={searchParams}
            />
      );
}

export default MemberIdPage;