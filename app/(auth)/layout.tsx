"use client"
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen w-full bg-gradient-to-br from-[#0F0C29] via-[#302B63] to-[#24243E] flex justify-center items-center">
      <div className="relative w-full max-w-md px-4">
        <div className="animate-pulse absolute -inset-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-30" />
        <div className="relative bg-[#161618]/90 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/10">
          {children}
        </div>
      </div>
    </div>
  )
}
export default AuthLayout;