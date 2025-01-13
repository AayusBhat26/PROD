import type { Metadata } from 'next'
import { Open_Sans } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@/components/providers/themes-providers'
import { cn } from '@/lib/utils'
import { ModalProvider } from '@/components/providers/modal-providers'
import { dark, neobrutalism, shadesOfPurple } from '@clerk/themes';
import { SocketProvider } from '@/components/providers/socket-providers'
import { QueryProvider } from '@/components/providers/query-providers'
const inter = Open_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'WORKIFY',
  description: '',
}
type BaseThemeTaggedType = {
  __type: string; // Example, replace with the actual type expected
  // Other properties...
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider appearance={{

      variables: { colorPrimary: '#6809C6' },
      signIn: {

        variables: { colorPrimary: '#6809C6' }
      },
      signUp: {

        variables: { colorPrimary: '#6809C6' }
      }
    }} >
      <html lang="en" >
        <body className={cn(inter.className, "  bg-white dark:bg-[#161618]")} suppressHydrationWarning>
          <ThemeProvider attribute='class' defaultTheme='dark' enableSystem={false} storageKey='theme_prod'>
            <SocketProvider >
              <ModalProvider />
              <QueryProvider>
                {children}
              </QueryProvider>
            </SocketProvider >
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
