import { Menu } from "lucide-react"
import {
      Sheet,
      SheetContent,
      SheetTrigger
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import TaskbarNavigation from "./navigations/sidebar-navigation";
import { HubSidebar } from "./hub/hub-sidebar";
export const MobileToggle = ({ hubsId }: { hubsId: string }) => {
      return (
            <Sheet>
                  <SheetTrigger asChild>
                        <Button variant={'transparent'} size={'icon'} className="md:hidden">
                              <Menu />
                        </Button>
                  </SheetTrigger>

                  <SheetContent side={'right'} className="flex gap-0 p-0">
                        <div className="w-[72px]">
                              <TaskbarNavigation />
                        </div>
                        <HubSidebar hubId={hubsId} />
                  </SheetContent>
            </Sheet >
      )
}