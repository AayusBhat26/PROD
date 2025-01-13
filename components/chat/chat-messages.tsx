"use client";

import { Member, Message, Profile } from "@prisma/client";
import { ChatWelcome } from "./chat-welcome";
import { useChatQuery } from "../hooks/use-chat-query";
import { Loader2, ServerCrashIcon } from "lucide-react";
import { Fragment, useRef, ElementRef, useCallback } from "react";
import { ChatItems } from "./chat-items";
import { format } from "date-fns";
import { useChatSocket } from "../hooks/use-chat";
import { useScroll } from "../hooks/use-scroll";
import { debounce } from "lodash";

type MessageWithMemberWithProfile = Message & {
      member: Member & {
            profile: Profile;
      };
};

interface ChatMessagesProps {
      name: string;
      member: Member;
      chatId: string;
      apiUrl: string;
      socketUrl: string;
      socketQuery: Record<string, string>;
      paramKey: "channelId" | "conversationId";
      paramValue: string;
      type: "channel" | "conversation";
}

const DATE_FORMAT = "d MMM yyyy, HH:mm";

export const ChatMessages = ({
      name,
      member,
      chatId,
      apiUrl,
      socketUrl,
      socketQuery,
      paramKey,
      paramValue,
      type,
}: ChatMessagesProps) => {
      const queryKey = `chat:${chatId}`;
      const addKey = `chat:${chatId}:messages`;
      const updateKey = `chat:${chatId}:messages:update`;

      const chatRef = useRef<ElementRef<"div">>(null);
      const bottomRef = useRef<ElementRef<"div">>(null);

      const {
            data,
            fetchNextPage,
            hasNextPage,
            isFetchingNextPage,
            status,
      } = useChatQuery({
            queryKey,
            apiUrl,
            paramKey,
            paramValue,
      });

      useChatSocket({ queryKey, addKey, updateKey });

      useScroll({
            chatRef,
            bottomRef,
            loadMore: fetchNextPage,
            shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
            count: data?.pages?.[0]?.items?.length ?? 0
      });

      const debouncedFetch = useCallback(
            debounce((fn: () => void) => fn(), 300),
            []
      );

      const handleFetchNextPage = useCallback(() => {
            debouncedFetch(() => {
                  if (!isFetchingNextPage && hasNextPage) {
                        fetchNextPage();
                  }
            });
      }, [debouncedFetch, fetchNextPage, isFetchingNextPage, hasNextPage]);

      const handleScroll = () => {
            const scrollTop = chatRef.current?.scrollTop;
            if (scrollTop === 0 && !isFetchingNextPage && hasNextPage) {
                  fetchNextPage();
            }
      };

      if (status === "pending") {
            return (
                  <div className="flex flex-col items-center justify-center flex-1">
                        <Loader2 className="my-4 h-7 w-7 text-zinc-500 animate-spin" />
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                              Loading messages...
                        </p>
                  </div>
            );
      }

      if (status === "error") {
            return (
                  <div className="flex flex-col items-center justify-center flex-1">
                        <ServerCrashIcon className="my-4 h-7 w-7 text-zinc-500" />
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                              Something went wrong!
                        </p>
                  </div>
            );
      }

      return (
            <div ref={chatRef} className="flex flex-col flex-1 py-4 overflow-y-auto" onScroll={handleScroll}>
                  {!hasNextPage && <ChatWelcome type={type} name={name} />}
                  {hasNextPage && (
                        <div className="flex justify-center">
                              {isFetchingNextPage ? (
                                    <Loader2 className="w-6 h-6 my-4 text-zinc-500 animate-spin" />
                              ) : (
                                    <button
                                          onClick={handleFetchNextPage}
                                          className="my-4 text-xs transition text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
                                    >
                                          Load previous messages
                                    </button>
                              )}
                        </div>
                  )}
                  <div className="flex flex-col-reverse mt-auto">
                        {data?.pages?.map((group, i) => (
                              <Fragment key={i}>
                                    {group.items.map((message: MessageWithMemberWithProfile) => (
                                          <ChatItems
                                                key={message.id}
                                                id={message.id}
                                                currentMember={member}
                                                member={message.member}
                                                content={message.content}
                                                fileUrl={message.iamgeUrl}
                                                deleted={message.deleted}
                                                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                                                isUpdated={message.updatedAt !== message.createdAt}
                                                socketUrl={socketUrl}
                                                socketQuery={socketQuery}
                                          />
                                    ))}
                              </Fragment>
                        ))}
                  </div>
                  <div ref={bottomRef} />
            </div>
      );
};