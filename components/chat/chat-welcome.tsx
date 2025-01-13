interface ChatWelcomeProps {
      name: string,
      type: "channel" | "conversation"
}
export const ChatWelcome = ({ name, type }: ChatWelcomeProps) => {
      return (
            <div className="flex justify-center px-4 mt-6 space-x-6" >
                  {type === "channel" && (
                        <div className="h-[75px] w-[75px] rounded-md bg-zinc-500 dark:bg-zinc-800 flex items-center justify-center   text-white tracking-wide text-[13px] font-bold" >
                              Channel
                        </div>
                  )}
                  <div className="font-bold textxl md:text-3xl">
                        {
                              type === 'channel' ? (
                                    <span >
                                          Current SubHub: {name.toLocaleUpperCase()}
                                          <br />
                                          {/* <p className="text-sm">In `${ }`</p> */}
                                    </span>

                              ) : ""
                        }
                        <p className="text-[15px] text-black dark:text-zinc-500 ">
                              {type === "channel" ? `Start of the conversation of ${name} SubHub` : `Start of the conversation in ${name}  `}
                        </p>
                  </div>

            </div>
      )
}