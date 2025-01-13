"use client";
// package imports
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
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
} from "../../components/ui/dialog";

// local uploads
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { FileUpload } from "../file-upload";
import { UserButton } from "@clerk/nextjs";

// todo: form schema
const formSchema = z.object({
  name: z.string().min(3, {
    message: "HUB with this personality requires a better Name!!!",
  }),
  imageUrl: z.string().min(1, {
    message:
      "To be build a better HUB, profile picture works as the cherry on the Cake.",
  }),
});
export const InitialModal = () => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // todo: form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // console.log(values);
    try {
      const data = await axios.post("/api/hubs/", values)
      console.log(data);
      
      form.reset();
      router.refresh();
      window.location.reload();
    } catch (error) {
      console.log(error);
      
    }
  };
  if (!isMounted) return null;
  return (
    <Dialog open={true}>
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
                className="text-xs"
                variant={"initial"}
                disabled={isLoading}
              >
                Create the DAMN HUB!!!
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
