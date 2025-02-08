"use client";

import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { MediaRoom } from "@/components/vc";
import { useTaskbarStore } from "@/hooks/use-taskbar-store";
import { cn } from "@/lib/utils";
import { Channel, ChannelType, Member } from "@prisma/client";

interface ChannelIdPageClientProps {
      channel: Channel;
      member: Member;
      params: {
            hubsId: string;
            channelId: string;
      };
}

export const ChannelIdPageClient = ({
      channel,
      member,
      params
}: ChannelIdPageClientProps) => {
      const { isVisible } = useTaskbarStore();

      return (
            <div className={cn(
                  "flex flex-col h-full bg-[#0A0A0A] dark:bg-[#0A0A0A] text-sm relative",
                  "transition-all duration-300 ease-in-out",
                  "md:pl-60",
                  isVisible ? "md:pr-[72px]" : "md:pr-0"
            )}>
                  <ChatHeader
                        name={channel.name}
                        hubsId={channel.serverId}
                        type="channel"
                  />
                  <div className="flex-1 overflow-y-auto pb-20 scrollbar-none">
                        {channel.type === ChannelType.TEXT && (
                              <div className="flex flex-col h-full">
                                    <div className="flex-1 overflow-y-auto px-4 scrollbar-none">
                                          <ChatMessages
                                                member={member}
                                                name={channel.name}
                                                chatId={channel.id}
                                                type="channel"
                                                apiUrl="/api/messages"
                                                socketUrl="/api/socket/messages"
                                                socketQuery={{
                                                      channelId: channel.id,
                                                      serverId: channel.serverId
                                                }}
                                                paramKey="channelId"
                                                paramValue={channel.id}
                                          />
                                    </div>
                                    <div className={cn(
                                          "absolute bottom-0 left-0 right-0 px-4 py-2 bg-[#0A0A0A] dark:bg-[#0A0A0A] shadow-lg",
                                          "transition-all duration-300 ease-in-out",
                                          "md:left-60",
                                          isVisible ? "md:right-[72px]" : "md:right-0"
                                    )}>
                                          <ChatInput
                                                name={channel.name}
                                                type="channel"
                                                apiUrl="/api/socket/messages"
                                                query={{
                                                      channelId: channel.id,
                                                      hubsId: params.hubsId
                                                }}
                                          />
                                    </div>
                              </div>
                        )}
                        {channel.type === ChannelType.AUDIO && (
                              <MediaRoom
                                    chatId={channel.id}
                                    video={false}
                                    audio={true}
                              />
                        )}
                        {channel.type === ChannelType.VIDEO && (
                              <MediaRoom
                                    chatId={channel.id}
                                    video={true}
                                    audio={false}
                              />
                        )}
                        {channel.type === ChannelType.CODE && (
                              <div>
                                    code
                              </div>
                        )}
                  </div>
            </div>
      );
}; 