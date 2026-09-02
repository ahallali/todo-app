import { act, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '@/store/store';
import { addTodo, resetStore } from '@/store/slices/todoSlice';
import { serializeTaskBackup, TASK_STORAGE_KEY } from '@/lib/task-backup';
import TaskPersistence from './TaskPersistence';
const task = { id: 'one', title: 'Persist me', completed: false, createdAt: '2026-09-02T12:00:00.000Z' };
let saved: Map<string, string>;
let write: jest.Mock;
beforeEach(() => {
  saved = new Map();
  write = jest.fn((key: string, value: string) => saved.set(key, value));
  Object.defineProperty(window, 'localStorage', { configurable: true, value: {
    getItem: (key: string) => saved.get(key) ?? null, setItem: write,
  }});
});
function mount() {
  const store = configureStore({ reducer: rootReducer });
  const view = render(<Provider store={store}><TaskPersistence><p>Task workspace</p></TaskPersistence></Provider>);
  return { store, ...view };
}
it('restores on mount without overwriting the saved backup', () => {
  saved.set(TASK_STORAGE_KEY, serializeTaskBackup([task]));
  const { store } = mount();
  expect(store.getState().todos.todos).toEqual([task]);
  expect(write).not.toHaveBeenCalled();
});
it('survives a fresh store and reset preserves unrelated storage', () => {
  saved.set('unrelated', 'keep');
  const first = mount();
  act(() => { first.store.dispatch(addTodo(task)); });
  first.unmount();
  const second = mount();
  expect(second.store.getState().todos.todos).toEqual([task]);
  act(() => { second.store.dispatch(resetStore()); });
  expect(JSON.parse(saved.get(TASK_STORAGE_KEY)!).tasks).toEqual([]);
  expect(saved.get('unrelated')).toBe('keep');
});
it('preserves corrupted data and warns instead of silently erasing it', () => {
  saved.set(TASK_STORAGE_KEY, 'corrupted');
  const { store } = mount();
  act(() => { store.dispatch(addTodo(task)); });
  expect(screen.getByRole('alert')).toHaveTextContent('left untouched');
  expect(saved.get(TASK_STORAGE_KEY)).toBe('corrupted');
});
it('reports quota failures without losing the in-memory task', () => {
  write.mockImplementation(() => { throw new Error('Quota exceeded'); });
  const { store } = mount();
  act(() => { store.dispatch(addTodo(task)); });
  expect(screen.getByRole('alert')).toHaveTextContent('could not be saved');
  expect(store.getState().todos.todos).toEqual([task]);
});
