"use client";
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { ThemeProvider } from './ThemeProvider';
import TaskPersistence from './TaskPersistence';
import ThemeButton from './ThemeButton';

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return <Provider store={store}><ThemeProvider><ThemeButton /><TaskPersistence>{children}</TaskPersistence></ThemeProvider></Provider>;
}
