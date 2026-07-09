import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { Roboto, Geist_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/features/auth/AuthProvider';
import { I18nProvider } from '@/components/providers/I18nProvider';

const roboto = Roboto({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
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
      className={`${roboto.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex h-screen flex-col overflow-y-auto">
        <div className="floating-gradient-bg" aria-hidden="true" />
        <I18nProvider lng={lng}>
          <AuthProvider>
            <Toaster position="bottom-center" offset={24} />
            <Header />
            <main className="flex min-h-0 flex-1 flex-col items-center overflow-y-auto font-sans">
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
