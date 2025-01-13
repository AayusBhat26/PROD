"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "../hooks/use-modal-store";
import { Button } from "../../components/ui/button";

export const DeleteServerModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === "deleteServer";
  const { server } = data;

  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      
      setIsLoading(true);
      await axios.delete(`/api/hubs/${server?.id}`);
      onClose();
      router.refresh();
      router.push("/");

    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="dark:text-white  p-0 overflow-hidden dark:bg-zinc-950 bg-white text-black">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Delete Server
          </DialogTitle>
          <DialogDescription className="text-center ">
           {/* delete server */}
            <div className="font"> Are you  <span className="font-semibold text-purple-700 capitalize mr-[5px]">sure</span>you want to <span className="font-semibold text-purple-700 capitalize mr-[5px]">Delete</span>
              <span className="font-semibold text-purple-700 capitalize">{server?.name}</span>?</div>
            <br />
            <br />
            <span className="font-xs text-zinc-500">By confirming, this will delete the entire server, this action is not revertable. Are you Sure you want to continue?</span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className=" text-white px-6 py-4">
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