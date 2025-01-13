"use client";
import { useSocket } from "./providers/socket-providers";
import { Badge } from "./ui/badge";
export const Indicator = () => {
      const { isConnected } = useSocket();
      if (!isConnected) {
            return (
                  <Badge variant={'outline'} className="text-white border-none bg-rose-400 text-[5px] text-center">
                        Not Connected </Badge>
            )
      }
      return (
            <Badge variant={'outline'} className="text-[8px] text-white bg-blue-700 border-none">
                  Connected </Badge>
      )
}