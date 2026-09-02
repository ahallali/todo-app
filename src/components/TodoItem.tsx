'use client';

import React, { useState } from 'react';
import { useAppDispatch } from '@/lib/dispatch';
import { toggleTodo, deleteTodo, editTodo } from '@/store/slices/todoSlice';
import { Todo } from '@/store/slices/todoSlice';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState('');

  const handleEdit = () => {
    if (editText.trim() === '') {
      setError('Title cannot be empty');
      return;
    }
    setError('');
    dispatch(editTodo({ 
      id: todo.id, 
      title: editText.trim(),
      description: editDescription.trim() || undefined,
      updatedAt: new Date().toISOString()
    }));
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEdit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditText(todo.title);
      setEditDescription(todo.description || '');
      setError('');
    }
  };

  return (
    <div
      className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 transition-all duration-300 hover:shadow-md"
    >
      <div className="flex items-start space-x-4">
        <button
          onClick={() => dispatch(toggleTodo(todo.id))}
          role="checkbox"
          aria-checked={todo.completed}
          aria-label={`Mark "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`}
          className={`mt-1 shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-300 ${
            todo.completed
              ? 'bg-gradient-to-r from-green-400 to-blue-500 border-transparent'
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-500'
          }`}
        >
          {todo.completed && (
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editText}
                onChange={(e) => {
                  setEditText(e.target.value);
                  setError('');
                }}
                onKeyDown={handleKeyDown}
                autoFocus
                className={`w-full bg-transparent border-b-2 mb-2 ${
                  error ? 'border-red-500' : 'border-blue-500'
                } focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 text-lg font-medium break-words`}
              />
              {error && (
                <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
              )}
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add a description (optional)"
                className="w-full bg-transparent border-b border-gray-200 dark:border-gray-700 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 resize-none text-sm break-words whitespace-pre-wrap"
                rows={1}
              />
            </div>
          ) : (
            <div className="space-y-1">
              <div
                className={`text-lg font-medium transition-colors duration-300 break-words ${
                  todo.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-gray-200'
                }`}
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {todo.title}
              </div>
              {todo.description && isExpanded && (
                <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap break-words">
                  {todo.description}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 opacity-100 transition-opacity duration-300">
          {isEditing ? (
            <>
              <button
                onClick={handleEdit}
                aria-label="Save changes"
                className="p-2 text-green-500 hover:text-green-600 dark:text-green-400 dark:hover:text-green-300 transition-colors duration-300"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </button>
              <button
                onClick={() => setIsEditing(false)}
                aria-label="Cancel editing"
                className="p-2 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-300"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                aria-label={`Edit "${todo.title}"`}
                className="p-2 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-300"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <button
                onClick={() => dispatch(deleteTodo(todo.id))}
                aria-label={`Delete "${todo.title}"`}
                className="p-2 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-300"
              >
                <svg
                  className="w-5 h-5"
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
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoItem;