"use client";
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { ThemeProvider } from './ThemeProvider';
import ThemeButton from './ThemeButton';

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return <Provider store={store}><ThemeProvider><ThemeButton />{children}</ThemeProvider></Provider>;
}
