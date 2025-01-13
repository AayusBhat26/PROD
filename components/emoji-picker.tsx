"use client";
interface EmojiPickerProps {
      onChange: (value: string) => void;
}
import {
      Popover,
      PopoverContent,
      PopoverTrigger,
} from "@/components/ui/popover";
import Picker from "@emoji-mart/react"
import { useTheme } from "next-themes"
import data from "@emoji-mart/data";
import { Smile } from "lucide-react";
export const EmojiPicker = ({
      onChange
}: EmojiPickerProps) => {
      const { resolvedTheme } = useTheme();
      return (
            <Popover>
                  <PopoverTrigger>
                        <Smile className="text-purple-500 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-300" />
                  </PopoverTrigger>
                  <PopoverContent
                        side="right"
                        sideOffset={40}
                        className="mb-16 bg-transparent border-none shadow-none drop-shadow-none"
                  >
                        <Picker
                              theme={resolvedTheme}
                              data={data}
                              onEmojiSelect={(emoji: any) => onChange(emoji.native)}
                        />
                  </PopoverContent>
            </Popover >
      )
}