"use client";
import { FileIcon, X } from "lucide-react";
import Image from "next/image";


import { UploadDropzone } from "@/lib/uploadthing";

import "@uploadthing/react/styles.css";


interface FileUploadProps {
      onChange: (url?: string) => void;
      value: string;
      endpoint: "messageFile" | "hubImage";
}
export const FileUpload = ({
      onChange, value, endpoint
}: FileUploadProps) => {
      const fileType = value?.split(".").pop();
      if (value && fileType !== 'pdf') {
            return (

                  <div className="relative w-20 h-20">
                        <Image fill src={value} alt={"upload"} className="rounded-xl"
                        />
                        <button onClick={() => onChange("")} className="absolute top-0 right-0 p-1 text-white rounded-full shadow-sm bg-rose-500" type="button"><X className="w-4 h-4" /></button>
                  </div>
            )
      }
      if (value && fileType === "pdf") {
            return (
                  <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
                        <FileIcon className="w-10 h-10 fill-purple-400 stroke-transparent" />
                        <a href={value} target="_blank" rel="noopener noreferrer" className="ml-2 text-sm text-indigo-600 dark:text-black hover:underline">
                              {value}
                        </a>
                        <button onClick={() => onChange("")} className="absolute p-1 text-white rounded-full shadow-sm -top-2 -right-2 bg-rose-500" type="button"><X className="w-4 h-4" /></button>
                  </div>
            )
      }
      return (
            <UploadDropzone endpoint={endpoint} onClientUploadComplete={(res) => {
                  onChange(res?.[0].url)
            }} onUploadError={(error: Error) => {
                  console.log(error)
            }} />

      )
}