"use client";

import { cn } from "@/lib/utils";
import { Channel, MemberRole, Server, ChannelType } from "@prisma/client";
import { Code, Ear, Edit, ListTodo, Lock, Mic, Pen, PenTool, PlusCircleIcon, Settings2Icon, Text, Timer, Trash, Video } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ActionTooltip } from "../actions-tooltip";
import { ModalType, useModal } from "../hooks/use-modal-store";

interface SubHubProps {
      channel: Channel;
      server: Server;
      role?: MemberRole;se
}
const iconMap = {
      [ChannelType.TEXT]: Text,
      [ChannelType.VIDEO]: Video,
      [ChannelType.AUDIO]: Mic,
      [ChannelType.CODE]: Code,
      [ChannelType.DRAWING]: PenTool,
      [ChannelType.pomofocus]: Timer,
      [ChannelType.TASK]: ListTodo,

}
export const SubHub = ({ channel, server, role }: SubHubProps) => {
      const { onOpen } = useModal();
      const params = useParams();
      const router = useRouter();
      const Icon = iconMap[channel.type];
      // for navigatiion of user between chats.
      const onClick = () => {
            router.push(`/hubs/${params?.hubsId}/channels/${channel.id}`)
      }
      // onAction is the alternative for onClick as it was overriding the edit onClick.
      const onAction = (e: React.MouseEvent, action: ModalType) => {
            e.stopPropagation();
            onOpen(action, { channel, server })
      }
      return (
            <button
                  onClick={onClick}
                  className={cn(
                        "cursor-pointer group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-purple-700/10 dark:hover:bg-purple-700/50 transition mb-1",
                        params?.channelId === channel.id && "bg-purple-700/20 dark:bg-purple-700"
                  )}
            >
                  <Icon className="flex-shrink-0 w-5 h-5 text-purple-500 dark:text-purple-400" />
                  <p className={cn(
                        "line-clamp-1 font-semibold text-sm text-purple-500 group-hover:text-purple-600 dark:text-purple-400 dark:group-hover:text-purple-300 transition",
                        params?.channelId === channel.id && "text-primary dark:text-purple-200 dark:group-hover:text-white"
                  )}>

                        {channel.name}
                  </p>
                  {channel.name !== "general" && role !== MemberRole.GUEST && (
                        <div className="flex items-center ml-auto gap-x-2">
                              <ActionTooltip label="Edit">
                                    <Edit
                                          // onClick={(e) => onAction(e, "editChannel")}
                                          onClick={(e) => onAction(e, 'editChannel')}
                                          className="hidden w-4 h-4 text-purple-500 transition group-hover:block hover:text-purple-600 dark:text-purple-400 dark:hover:text-purple-300"
                                    />
                              </ActionTooltip>
                              <ActionTooltip label="Delete">
                                    <Trash
                                          onClick={(e) => onAction(e, "deleteChannel")}
                                          className="hidden w-4 h-4 text-purple-500 transition group-hover:block hover:text-purple-600 dark:text-purple-400 dark:hover:text-purple-300"
                                    />
                              </ActionTooltip>
                        </div>
                  )}
                  {channel.name === "general" && (
                        <ActionTooltip label="No actions available.">
                              <Lock
                                    className="w-4 h-4 ml-auto text-purple-500 dark:text-purple-400"
                              />
                        </ActionTooltip>

                  )}
            </button>
      )
}
