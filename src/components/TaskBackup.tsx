"use client";
import { useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/dispatch';
import { importTodos } from '@/store/slices/todoSlice';
import { MAX_BACKUP_BYTES, parseTaskBackup, serializeTaskBackup } from '@/lib/task-backup';

export default function TaskBackup() {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(state => state.todos.todos);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  function exportBackup() {
    try {
      const url = URL.createObjectURL(new Blob([serializeTaskBackup(tasks)], { type: 'application/json' }));
      const link = document.createElement('a');
      link.href = url; link.download = 'tasks-backup.json'; link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setMessage('Backup downloaded. Keep it somewhere safe.');
    } catch { setMessage('Could not export tasks. Backups support up to 1,000 tasks and 2 MB.'); }
  }
  async function importBackup(file?: File) {
    if (!file) return;
    setBusy(true);
    try {
      if (file.size > MAX_BACKUP_BYTES) throw new Error('Backup exceeds 2 MB.');
      const incoming = parseTaskBackup(await file.text());
      const existing = new Set(tasks.map(task => task.id));
      const additions = incoming.filter(task => !existing.has(task.id));
      serializeTaskBackup([...tasks, ...additions]);
      dispatch(importTodos(additions));
      setMessage(`Imported ${additions.length} tasks. Existing tasks were kept.`);
    } catch { setMessage('Could not import this file. Choose a valid task backup under 2 MB; your tasks have not changed.'); }
    finally { setBusy(false); if (fileRef.current) fileRef.current.value = ''; }
  }
  return <section aria-label="Task backups" className="my-6 border-y border-gray-200 dark:border-gray-700 py-4">
    <div className="flex flex-wrap items-center gap-4">
      <button type="button" onClick={exportBackup} className="text-blue-700 dark:text-blue-300 underline underline-offset-4">Export backup</button>
      <label className="text-sm" htmlFor="task-backup">{busy ? 'Importing…' : 'Import backup'}</label>
      <input ref={fileRef} id="task-backup" type="file" accept=".json,application/json" disabled={busy} onChange={e => void importBackup(e.target.files?.[0])} className="min-w-0 max-w-full text-sm" />
    </div>
    <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">Import adds missing tasks and keeps existing versions. JSON only, up to 2 MB.</p>
    <p role="status" className="text-sm mt-2">{message}</p>
  </section>;
}
