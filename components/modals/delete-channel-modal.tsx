"use client";

import axios from "axios";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import qs from "query-string";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "../hooks/use-modal-store";
import { Button } from "../ui/button";

export const DeleteChannelModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();
  // const params = useParams();
  const isModalOpen = isOpen && type === "deleteChannel";
  const { server, channel } = data;

  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);
      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: {
          serverId: server?.id,
        }
      })
      await axios.delete(url);
      onClose();

      console.log(server);
      router.push(`/hubs/${server?.id}`)
      router.refresh();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 overflow-hidden text-black bg-white dark:text-white dark:bg-zinc-950">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-2xl font-bold text-center">
            Delete Channel
          </DialogTitle>
          <DialogDescription className="text-center ">
            {/* delete server */}
            <div className="font"> Are you  <span className="font-semibold text-purple-700 capitalize mr-[5px]">sure</span>you want to <span className="font-semibold text-purple-700 capitalize mr-[5px]">Delete the Channel</span>
              <span className="font-semibold text-purple-700 capitalize">  {channel?.name}</span>?</div>
            <br />
            <br />
            <span className="font-xs text-zinc-500">By confirming, this will delete the entire server, this action is not revertable. Are you Sure you want to continue?</span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="px-6 py-4 text-white ">
          <div className="flex items-center justify-between w-full">
            <Button
              disabled={isLoading}
              onClick={onClose}
              className="hover:bg-green-300"

            >
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              className="hover:bg-rose-400"
              onClick={onClick}
            >
              Continue
            </Button>

          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}