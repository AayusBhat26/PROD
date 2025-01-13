"use client";
import axios from "axios";
import { useState } from "react";
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

export const DeleteMessageModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "deleteMessage";
  const { apiUrl, query } = data;
  const [isLoading, setIsLoading] = useState(false);
  const onClick = async () => {
    try {
      setIsLoading(true);
      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query,
      })
      await axios.delete(url);
      onClose();
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
            <div className="font"> Are you  <span className="font-semibold text-purple-700 capitalize mr-[5px]">sure</span>you want to <span className="font-semibold text-purple-700 capitalize mr-[5px]">Delete the Message</span>
              <span className="font-semibold text-purple-700 capitalize">  This action cannot be reversed
              </span>
            </div>
            <br />
            <br />
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