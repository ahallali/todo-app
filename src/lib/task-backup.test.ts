import { parseTaskBackup, serializeTaskBackup } from './task-backup';
import reducer, { importTodos } from '@/store/slices/todoSlice';
const task = { id: 'one', title: 'Review keyboard navigation', completed: false, createdAt: '2026-09-02T12:00:00.000Z' };
it('round-trips task content including Unicode', () => {
  const tasks = [{ ...task, description: 'اختبار — café' }];
  expect(parseTaskBackup(serializeTaskBackup(tasks))).toEqual(tasks);
});
it.each([
  'not json',
  JSON.stringify({ version: 2, tasks: [] }),
  JSON.stringify({ version: 1, tasks: [{ ...task, completed: 'false' }] }),
  JSON.stringify({ version: 1, tasks: [{ ...task, createdAt: 'invalid' }] }),
  JSON.stringify({ version: 1, tasks: [task, task] }),
  JSON.stringify({ version: 1, tasks: [{ ...task, title: ' ' }] }),
])('rejects malformed data without producing partial results', raw => {
  expect(() => parseTaskBackup(raw)).toThrow();
});
it('rejects oversized files', () => {
  expect(() => parseTaskBackup(' '.repeat(2_000_001))).toThrow('2 MB');
});
it('keeps existing tasks when importing IDs already present', () => {
  const state = reducer(undefined, importTodos([task]));
  const merged = reducer(state, importTodos([{ ...task, title: 'Old backup' }, { ...task, id: 'two' }]));
  expect(merged.todos).toEqual([task, { ...task, id: 'two' }]);
});
