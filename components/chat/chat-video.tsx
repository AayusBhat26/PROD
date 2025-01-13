"use client";
import qs from "query-string";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Video, VideoOff } from "lucide-react";

import { ActionTooltip } from "../actions-tooltip";
export const ChatVideo = () => {

      const searchParams = useSearchParams();
      const pathname = usePathname();
      const router = useRouter();
      const isVideo = searchParams?.get("video");
      const Icon = isVideo ? VideoOff : Video;
      const toolTipLabel = isVideo ? "END" : "START";
      const onClick = () => {
            const url = qs.stringifyUrl({
                  url: pathname || '',
                  query: {
                        video: isVideo ? undefined : true,
                  }
            }, { skipNull: true }
            )
            router.push(url);
      }

      return (
            <ActionTooltip side="top" label={toolTipLabel}
            >
                  <button onClick={onClick} className="hover:opacity-80">
                        <Icon className="w-6 h-6 text-blue-500 dark:text-purple-500" />
                  </button>

            </ActionTooltip>
      )
}