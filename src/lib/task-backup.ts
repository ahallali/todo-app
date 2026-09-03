import { z } from 'zod';

export const TASK_STORAGE_KEY = 'ahallali.tasks.v1';
export const MAX_BACKUP_BYTES = 2_000_000;
const task = z.object({
  id: z.string().min(1).max(100),
  title: z.string().trim().min(1).max(200),
  description: z.string().max(5000).optional(),
  completed: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
});
const backup = z.object({ version: z.literal(1), tasks: z.array(task).max(1000) })
  .refine(value => new Set(value.tasks.map(t => t.id)).size === value.tasks.length, 'Duplicate task IDs');
export function parseTaskBackup(raw: string) {
  if (new TextEncoder().encode(raw).length > MAX_BACKUP_BYTES) throw new Error('Backup exceeds 2 MB.');
  const result = backup.safeParse(JSON.parse(raw));
  if (!result.success) throw new Error('Invalid task backup. Export a version 1 backup from this app.');
  return result.data.tasks;
}
export function serializeTaskBackup(tasks: z.infer<typeof task>[]) {
  const raw = JSON.stringify({ version: 1, tasks }, null, 2);
  parseTaskBackup(raw);
  return raw;
}
