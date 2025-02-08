"use client";

import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { MediaRoom } from "@/components/vc";
import { useTaskbarStore } from "@/hooks/use-taskbar-store";
import { cn } from "@/lib/utils";
import { Member, Profile, Server } from "@prisma/client";

interface MemberIdPageClientProps {
      currentMember: Member & {
            profile: Profile;
      };
      otherMember: Member & {
            profile: Profile;
      };
      conversation: any; // Add proper type based on your conversation type
      params: {
            memberId: string;
            hubsId: string;
      };
      searchParams: {
            video?: boolean;
      };
}

export const MemberIdPageClient = ({
      currentMember,
      otherMember,
      conversation,
      params,
      searchParams
}: MemberIdPageClientProps) => {
      const { isVisible } = useTaskbarStore();

      return (
            <div className={cn(
                  "flex flex-col h-full bg-[#0A0A0A] dark:bg-[#0A0A0A] text-sm relative",
                  "transition-all duration-300 ease-in-out",
                  "md:pl-60",
                  isVisible ? "md:pr-[72px]" : "md:pr-0"
            )}>
                  <ChatHeader 
                        imageUrl={otherMember.profile.imageUrl || ''} 
                        name={otherMember.profile.name || ''} 
                        hubsId={params.hubsId} 
                        type='conversation' 
                  />
                  <div className="flex-1 overflow-y-auto pb-20 scrollbar-none">
                        {searchParams.video ? (
                              <div className="flex-1 p-4">
                                    <MediaRoom 
                                          chatId={conversation.id}
                                          video={true}
                                          audio={false}
                                    />
                              </div>
                        ) : (
                              <div className="flex flex-col h-full">
                                    <div className="flex-1 overflow-y-auto px-4 scrollbar-none">
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
                                          />
                                    </div>
                                    <div className={cn(
                                          "absolute bottom-0 left-0 right-0 px-4 py-2 bg-[#0A0A0A] dark:bg-[#0A0A0A] shadow-lg",
                                          "transition-all duration-300 ease-in-out",
                                          "md:left-60",
                                          isVisible ? "md:right-[72px]" : "md:right-0"
                                    )}>
                                          <ChatInput
                                                name={otherMember.profile.name || ""}
                                                type="conversation"
                                                apiUrl="/api/socket/direct-messages"
                                                query={{
                                                      conversationId: conversation.id
                                                }}
                                          />
                                    </div>
                              </div>
                        )}
                  </div>
            </div>
      );
}; 