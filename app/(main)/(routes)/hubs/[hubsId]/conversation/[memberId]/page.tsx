import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { MediaRoom } from "@/components/vc";
import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface MemberIdPageProps {
      params: {
            memberId: string,
            hubsId: string,
      },
      searchParams: {
            video?: boolean,
      }
}

const MemberIdPage = async ({
      params, searchParams
}: MemberIdPageProps) => {
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
      // serverId: params.hubsId, profileId: profile.id
      const conversation = await getOrCreateConversation(currentMember.id, params.memberId);

      if (!conversation) return redirect(`/hubs/${params.hubsId}`)
      const { memberOne, memberTwo } = conversation;
      const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne;
      return (
            <div className="flex flex-col h-full bg-white dark:bg-transparent" >

                  <ChatHeader imageUrl={otherMember.profile.imageUrl || ''} name={otherMember.profile.name || ''} hubsId={params.hubsId} type='conversation' />
                  {searchParams.video && (
                        <MediaRoom chatId={conversation.id}
                              video={true}
                              audio={false}
                        />
                  )}
                  {!searchParams.video && (
                        <>
                              <ChatMessages
                                    member={currentMember}
                                    name={otherMember.profile.name || ""}
                                    chatId={conversation.id}
                                    type="conversation"
                                    apiUrl="/api/direct-messages"
                                    paramKey="conversationId"
                                    paramValue={conversation.id}
                                    socketUrl="/api/socket/direct-messages"
                                    socketQuery={{
                                          conversationId: conversation.id
                                    }}
                                    fileUrl=""
                              />
                              <ChatInput
                                    name={otherMember.profile.name || ""}
                                    type="conversation"
                                    apiUrl="/api/socket/direct-messages"
                                    query={{
                                          conversationId: conversation.id
                                    }}
                              />
                        </>
                  )}

            </div>
      )
}
export default MemberIdPage;