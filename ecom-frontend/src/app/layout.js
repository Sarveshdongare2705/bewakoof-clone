// app/layout.js or app/layout.tsx
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import './globals.css';
import { Montserrat, Montserrat_Alternates, Outfit, Poppins } from 'next/font/google';
import { Toaster } from 'sonner';

const montserratAlternates = Montserrat_Alternates({
  variable: '--font-montserrat-alternates',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata = {
  title: 'Bewakoof',
  description: 'Your e-commerce shopping website',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${montserratAlternates.variable} font-sans w-screen overflow-x-hidden scrollbar-hide scroll-smooth`}>
        <Navbar />
        <div className='pt-20'>{children}</div>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}