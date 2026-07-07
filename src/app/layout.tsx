import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/features/auth/AuthProvider';
import { I18nProvider } from '@/components/providers/I18nProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Swagger Editor App',
  description: 'Swagger/OpenAPI UI',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const lng = cookieStore.get('app_language')?.value ?? 'en';

  return (
    <html
      lang={lng}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <I18nProvider lng={lng}>
          <AuthProvider>
            <Toaster position="bottom-center" offset={24} />
            <Header />
            <main className="flex flex-1 flex-col items-center justify-center bg-zinc-50 font-sans">
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
