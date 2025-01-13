"use client";
// package imports
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";

// shadcn imports
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

// local uploads
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FileUpload } from "../file-upload";
import { useModal } from "../hooks/use-modal-store";
import { useEffect } from "react";

// todo: form schema
const formSchema = z.object({
  name: z.string().min(3, {
    message: "HUB with this personality requires a better Name!!!",
  }),
  imageUrl: z.string().min(1, {
    message:
      "To build a better HUB, profile picture works as the cherry on the Cake.",
  }),
});
export const EditHubModal = () => {
  const {isOpen, onClose, type, data}= useModal();
  const router = useRouter();


  const isModalOpen = isOpen && type==="editHub";
  const {server} = data;


  // todo: form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });
  useEffect(()=>{
    if(server){
      form.setValue("name", server.name || "")
      form.setValue("imageUrl", server.imageUrl || "")
    }
  },[server, form])
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {

    try {
      await axios.patch(`/api/hubs/${server?.id}`, values)
      form.reset();
      router.refresh();
      onClose();
    } catch (error) {
      console.log(error);
      
    }
  };
  const handleClose = ()=>{
    form.reset();
    onClose();
  }
  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            CREATE A HUB
          </DialogTitle>
          <DialogDescription className="text-center text-blue-300">
            Provide your HUB a personality make over.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            suppressHydrationWarning
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 text-xs"
          >
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                {/* todo: image uploading, cloudnariy. */}
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="hubImage"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-blue-500 dark:text-secondary/60">
                      HUB NAME
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/40 border-0 focus-visible:ring-1 text-black focus-visible:ring-offset-0"
                        placeholder="Enter the HUB Name."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-blue-300 font-bold text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button
                className="text-xs bg-blue-500 hover:bg-green-400"
                
                disabled={isLoading}
              >
                Save Settings
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
