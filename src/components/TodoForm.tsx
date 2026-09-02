'use client';

import React, { useState } from 'react';
import { useAppDispatch } from '@/lib/dispatch';
import { addTodo } from '@/store/slices/todoSlice';
import { v4 as uuidv4 } from 'uuid';

const TodoForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      dispatch(
        addTodo({
          id: uuidv4(),
          title: title.trim(),
          description: description.trim() || undefined,
          completed: false,
          createdAt: new Date().toISOString(),
        })
      );
      setTitle('');
      setDescription('');
      setIsExpanded(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4"
    >
      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a new task"
            aria-label="New task title"
            className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </div>

        {isExpanded && (
          <div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description (optional)"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300 resize-none"
              rows={3}
            />
          </div>
        )}

        <div className="flex flex-wrap gap-2 justify-between items-center">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? 'Hide description' : 'Add description'}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-300"
          >
            {isExpanded ? 'Hide description' : 'Add description'}
          </button>

          <button
            type="submit"
            disabled={!title.trim()}
            aria-label="Add new todo"
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
              title.trim()
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
            }`}
          >
            Add Todo
          </button>
        </div>
      </div>
    </form>
  );
};

export default TodoForm;