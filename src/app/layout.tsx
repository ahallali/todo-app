import "./globals.css";
import AppProviders from '@/components/AppProviders';
export { metadata } from './metadata';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><AppProviders>{children}</AppProviders></body></html>;
}
