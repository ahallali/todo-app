"use client";
import { useEffect, useState } from 'react';
import { useStore } from 'react-redux';
import { RootState } from '@/store/store';
import { restoreTodos } from '@/store/slices/todoSlice';
import { parseTaskBackup, serializeTaskBackup, TASK_STORAGE_KEY } from '@/lib/task-backup';

export default function TaskPersistence({ children }: { children: React.ReactNode }) {
  const store = useStore<RootState>();
  const [ready, setReady] = useState(false);
  const [warning, setWarning] = useState('');
  useEffect(() => {
    let writable = true;
    try {
      const saved = localStorage.getItem(TASK_STORAGE_KEY);
      if (saved) store.dispatch(restoreTodos(parseTaskBackup(saved)));
    } catch {
      writable = false;
      setWarning('Saved tasks could not be loaded. Your existing backup has been left untouched. Export any new tasks before leaving.');
    }
    setReady(true);
    let previous = store.getState().todos.todos;
    const unsubscribe = store.subscribe(() => {
      const tasks = store.getState().todos.todos;
      if (tasks === previous || !writable) return;
      previous = tasks;
      try {
        localStorage.setItem(TASK_STORAGE_KEY, serializeTaskBackup(tasks));
        setWarning('');
      } catch {
        setWarning('Your latest changes could not be saved in this browser. Export a backup before leaving.');
      }
    });
    return unsubscribe;
  }, [store]);
  if (!ready) return <p role="status" className="p-8">Loading your tasks…</p>;
  return <>{warning && <p role="alert" className="p-4 border-b border-amber-600 text-amber-900 bg-amber-50">{warning}</p>}{children}</>;
}
