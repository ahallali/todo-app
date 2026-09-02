import React from 'react';
import { useAppDispatch } from '@/lib/dispatch';
import { useAppSelector } from '@/lib/dispatch';
import { setSortField, setSortOrder, SortField, SortOrder } from '@/store/slices/todoSlice';
import { RootState } from '@/store/store';

const SortControls: React.FC = () => {
  const dispatch = useAppDispatch();
  const { sortField, sortOrder } = useAppSelector((state: RootState) => state.todos);

  const handleSortFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setSortField(e.target.value as SortField));
  };

  const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setSortOrder(e.target.value as SortOrder));
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 my-4">
      <div className="flex-1 min-w-0">
        <label htmlFor="sortField" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Sort by
        </label>
        <select
          id="sortField"
          value={sortField}
          onChange={handleSortFieldChange}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="title">Title</option>
          <option value="createdAt">Date Created</option>
          <option value="completed">Completion Status</option>
        </select>
      </div>
      <div className="flex-1 min-w-0">
        <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Order
        </label>
        <select
          id="sortOrder"
          value={sortOrder}
          onChange={handleSortOrderChange}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </div>
  );
};

export default SortControls; 