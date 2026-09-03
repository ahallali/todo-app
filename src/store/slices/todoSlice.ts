import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type SortField = 'title' | 'createdAt' | 'completed';
export type SortOrder = 'asc' | 'desc';

interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  updatedAt?: string;
}

interface TodoState {
  todos: Todo[];
  filter: 'all' | 'active' | 'completed';
  searchQuery: string;
  sortField: SortField;
  sortOrder: SortOrder;
}

    const initialState: TodoState = {
      todos: [],
      filter: 'all',
      searchQuery: '',
      sortField: 'createdAt',
      sortOrder: 'asc',
    };

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    restoreTodos: (state, action: PayloadAction<Todo[]>) => { state.todos = action.payload; },
    importTodos: (state, action: PayloadAction<Todo[]>) => {
      const existing = new Set(state.todos.map(todo => todo.id));
      state.todos.push(...action.payload.filter(todo => !existing.has(todo.id)));
    },
    addTodo: (state, action: PayloadAction<Todo>) => {
      state.todos.push(action.payload);
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    deleteTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
    },
    editTodo: (state, action: PayloadAction<Partial<Todo> & { id: string }>) => {
      const todo = state.todos.find((t) => t.id === action.payload.id);
      if (todo) {
        Object.assign(todo, action.payload);
        todo.updatedAt = new Date().toISOString();
      }
    },
    setFilter: (state, action: PayloadAction<'all' | 'active' | 'completed'>) => {
      state.filter = action.payload;
    },
    clearCompleted: (state) => {
      state.todos = state.todos.filter((todo) => !todo.completed);
    },
    toggleAll: (state) => {
      const allCompleted = state.todos.every(todo => todo.completed);
      state.todos.forEach(todo => {
        todo.completed = !allCompleted;
        todo.updatedAt = new Date().toISOString();
      });
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSortField: (state, action: PayloadAction<SortField>) => {
      state.sortField = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<SortOrder>) => {
      state.sortOrder = action.payload;
    },
    resetStore: () => initialState,
  },
});

export const { restoreTodos, importTodos, addTodo, toggleTodo, deleteTodo, editTodo, setFilter, clearCompleted, toggleAll, setSearchQuery, setSortField,
  setSortOrder, resetStore } = todoSlice.actions;
export type { Todo };
export default todoSlice.reducer; 