'use client';

import { useAppDispatch, useAppSelector } from '@/lib/dispatch';
import { setFilter , clearCompleted , toggleAll , setSearchQuery , resetStore } from '@/store/slices/todoSlice';
import TodoForm from '@/components/TodoForm';
import TodoItem from '@/components/TodoItem';
import { useState } from 'react';
import SortControls from '@/components/SortControls';
import { useRouter } from 'next/navigation';


export default function TodosPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const todos = useAppSelector((state) => state.todos.todos);
  const {filter,  searchQuery , sortField, sortOrder } = useAppSelector((state) => state.todos);
  const [showError, setShowError] = useState(false);

  const handleLogout = () => {
    dispatch(resetStore());
    router.push('/');
  };

  const handleFilterChange = (newFilter: 'all' | 'active' | 'completed') => {
    dispatch(setFilter(newFilter));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    dispatch(setSearchQuery(value));
    setShowError(value !== '' && !todos.some(todo => (filter === 'all' || (filter === 'active' && !todo.completed) || (filter === 'completed' && todo.completed)) && todo.title.toLowerCase().includes(value.toLowerCase())));
  };


  const filteredTodos = todos
    .filter((todo) => {
      const matchesFilter =
        filter === 'all' || (filter === 'active' && !todo.completed) || (filter === 'completed' && todo.completed);
      const matchesSearch = todo.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'completed':
          comparison = (a.completed ? 1 : 0) - (b.completed ? 1 : 0);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            Todo App
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <button 
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-red-600"
            >
              Reset demo
            </button>
          </div>
        </div>
        <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">Frontend demo · No account needed. Tasks reset when you reload or reset the demo.</p>
        <div className="relative">
              <input
                type="text"
                placeholder="Search todos..."
                value={ searchQuery }
                onChange={handleSearchChange}
                className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300 text-gray-900 dark:text-white bg-white dark:bg-gray-800"
              />
        </div>
        {showError && (
          <div className="text-red-500 text-center mt-4">
            No todos found matching your search
          </div>
        )}
        <SortControls />
        <TodoForm />

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-3 justify-between items-center">
              <div className="flex flex-wrap gap-2">
                {['all', 'active', 'completed'].map((f) => (
                  <button
                    key={f}
                    onClick={() => handleFilterChange(f as 'all' | 'active' | 'completed')}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                      filter === f
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
              <button
                onClick={() => dispatch(clearCompleted())}
                className="group relative p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors duration-200 shadow-sm hover:shadow-md"
                title="Clear Completed"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  Clear Completed
                </span>
              </button>
            </div>
          </div>
          <div className="space-y-3 mt-6">
            {todos.length > 0 && (
              <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 transition-all duration-300">
                <button
                  onClick={() => dispatch(toggleAll())}
                  className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors duration-300"
                >
                  Check All
                </button>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {todos.filter(todo => todo.completed).length} of {todos.length} completed
                </span>
              </div>
            )}
            {filteredTodos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
            {filteredTodos.length === 0 && !showError && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                {filter === 'active' 
                  ? 'No active tasks. Add a new task or mark some as active'
                  : filter === 'completed'
                  ? 'No completed tasks yet. Complete some tasks to see them here'
                  : 'No tasks yet. Add your first task to get started'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}