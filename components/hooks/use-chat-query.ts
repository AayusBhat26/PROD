import qs from "query-string";
import { useParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSocket } from "../providers/socket-providers";
import { NextResponse } from "next/server";

interface ChatQueryProps {
      queryKey: string;
      apiUrl: string;
      paramKey: "channelId" | "conversationId";
      paramValue: string;
};

export const useChatQuery = ({ queryKey, apiUrl, paramKey, paramValue }: ChatQueryProps) => {
      const { isConnected } = useSocket();
      
      const fetchMessages = async ({ pageParam = '' }) => {
            try {
                  const url = qs.stringifyUrl({
                        url: apiUrl,
                        query: {
                              cursor: pageParam,
                              [paramKey]: paramValue
                        }
                  }, { skipNull: true });
                  
                  const res = await fetch(url, {
                        cache: 'no-store'
                  });
                  return res.json();
            } catch (error) {
                  console.log('fetch messages_use_chat_query', error);
                  return new NextResponse("error")
            }
      };

      return useInfiniteQuery({
            initialPageParam: '',
            queryKey: [queryKey],
            queryFn: fetchMessages,
            getNextPageParam: (lastPage) => lastPage?.nextCursor,
            refetchInterval: isConnected ? 1000 : false,
            staleTime: 0,
            gcTime: 0,
      });
};