import { SignIn } from "@clerk/nextjs";
// import {dark} from "@clerk/themes";
export default function Home() {
      return (
            <div className="text-white"  > 
                  <SignIn />

            </div>
      )
}