import { Hash } from "lucide-react";
import { MobileToggle } from "../toggle-mobile";
import { UserAvatar } from "../user-avatar";
import { ChatVideo } from "./chat-video";
interface ChatHeaderProps {
      hubsId: string;
      name: string;
      type: "channel" | "conversation";
      imageUrl?: string;
}
export const ChatHeader = ({ hubsId, name, type, imageUrl }: ChatHeaderProps) => {
      return (
            <div className="flex items-center justify-between h-12 px-3 font-semibold border-[0.5px] border-neutral-200 text-md  dark:border-blue-500 rounded-sm ">
                  <MobileToggle hubsId={hubsId} />
                  {type === "channel" && (
                        <div className="text-[10px] mr-[5px] bg-purple-700 p-1.5 rounded-lg border-1 border-white" >Sub Hub:</div>
                  )}
                  {type === "conversation" && (
                        <UserAvatar src={imageUrl} className="w-8 h-8 mr-4 md:h-8 md:w-8" />
                  )}
                  <p className="font-semibold text-black text-md dark:text-white">{name}</p>
                  {type === "conversation" && (
                        <ChatVideo />
                  )}
                  {/* <div className="flex items-center ml-auto">
                        <Indicator />
                  </div> */}
            </div>
      )
}