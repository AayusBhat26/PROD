// "use client"
import TaskbarNavigation from "@/components/navigations/sidebar-navigation";

const MainLayout = async ({ children }: {
      children: React.ReactNode;
}) => {
      return (<div className="h-full">

            {/* creating the view single hub responsive, forgot to add the code for login and signup */}
            <div className="fixed inset-y-0 right-0 z-30 flex-col hidden h-full md:flex">
                  {/* right-0 inset-y-0*/}
                  <TaskbarNavigation />
            </div>
            <main className="md:pr-[72px] h-full inset-y-0 right-0 ">
                  {children}
            </main>

      </div>);
}

export default MainLayout;

// this is the layout page for the single hub.