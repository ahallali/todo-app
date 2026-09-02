import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TodosPage from './page'
import { setSortField, setSortOrder, resetStore } from '@/store/slices/todoSlice'
import '@testing-library/jest-dom'
import { act } from 'react'
import { Provider } from 'react-redux'
import { store } from '@/store/store'

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

jest.mock('@/components/ThemeProvider', () => ({
  useTheme: () => ({ theme: 'light' }),
}))

jest.mock('@/components/TodoForm', () => ({
  __esModule: true,
  default: () => <div data-testid="todo-form">Todo Form</div>,
}))

jest.mock('@/components/TodoItem', () => ({
  __esModule: true,
  default: ({ todo }: { todo: import('@/store/slices/todoSlice').Todo }) => (
    <div data-testid={`todo-item-${todo.id}`}>{todo.title}</div>
  ),
}))

jest.mock('@/components/SortControls', () => ({
  __esModule: true,
  default: () => <div data-testid="sort-controls">Sort Controls</div>,
}))

describe('TodosPage', () => {
  const mockTodos = [
    {
      id: '1',
      title: 'Test Todo 1',
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Test Todo 2',
      completed: true,
      createdAt: new Date().toISOString(),
    },
  ]

  const renderWithRedux = (component: React.ReactElement) => {
    return render(
      <Provider store={store}>
        {component}
      </Provider>
    )
  }

  beforeEach(() => {
    store.dispatch(resetStore())
    
    mockTodos.forEach(todo => {
      store.dispatch({
        type: 'todos/addTodo',
        payload: todo,
      })
    })
  })

  it('renders todo list and controls', () => {
    renderWithRedux(<TodosPage />)
    
    expect(screen.getByText('Todo App')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Search todos...')).toBeInTheDocument()
    expect(screen.getByText('All')).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()
    expect(screen.getByText('Completed')).toBeInTheDocument()
  })

  it('handles filter changes', async () => {
    renderWithRedux(<TodosPage />)
    
    const activeButton = screen.getByText('Active')
    await act(async () => {
      fireEvent.click(activeButton)
    })

    const state = store.getState()
    expect(state.todos.filter).toBe('active')
  })

  it('handles search input', async () => {
    renderWithRedux(<TodosPage />)
    
    const searchInput = screen.getByPlaceholderText('Search todos...')
    await act(async () => {
      await userEvent.type(searchInput, 'test')
    })

    const state = store.getState()
    expect(state.todos.searchQuery).toBe('test')
  })

  it('shows error message when no todos match search', async () => {
    renderWithRedux(<TodosPage />)
    
    const searchInput = screen.getByPlaceholderText('Search todos...')
    await act(async () => {
      await userEvent.type(searchInput, 'nonexistent')
    })

    expect(screen.getByText('No todos found matching your search')).toBeInTheDocument()
  })

  it('handles clear completed', async () => {
    renderWithRedux(<TodosPage />)
    
    const clearButton = screen.getByTitle('Clear Completed')
    await act(async () => {
      fireEvent.click(clearButton)
    })

    const state = store.getState()
    expect(state.todos.todos.filter(todo => todo.completed)).toHaveLength(0)
  })

  it('handles toggle all', async () => {
    renderWithRedux(<TodosPage />)
    
    const toggleAllButton = screen.getByText('Check All')
    await act(async () => {
      fireEvent.click(toggleAllButton)
    })

    const state = store.getState()
    expect(state.todos.todos.every(todo => todo.completed)).toBe(true)
  })

  it('resets the demo without clearing unrelated browser storage', async () => {
    const mockLocalStorage = {
      clear: jest.fn(),
    }
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
    })

    renderWithRedux(<TodosPage />)
    
    const logoutButton = screen.getByText('Reset demo')
    await act(async () => {
      fireEvent.click(logoutButton)
    })

    expect(mockLocalStorage.clear).not.toHaveBeenCalled()
    const state = store.getState()
    expect(state.todos.todos).toHaveLength(0)
  })

  it('displays completion status', () => {
    renderWithRedux(<TodosPage />)
    
    expect(screen.getByText('1 of 2 completed')).toBeInTheDocument()
  })

  it('shows appropriate message when no todos match filter', async () => {
    renderWithRedux(<TodosPage />)
    
    await act(async () => {
      store.dispatch(resetStore())

      const activeButton = screen.getByText('Active')
      fireEvent.click(activeButton)
    })
    
    expect(screen.getByText('No active tasks. Add a new task or mark some as active')).toBeInTheDocument()
  })

  it('renders todo items', () => {
    renderWithRedux(<TodosPage />)
    
    expect(screen.getByTestId('todo-item-1')).toHaveTextContent('Test Todo 1')
    expect(screen.getByTestId('todo-item-2')).toHaveTextContent('Test Todo 2')
  })

  it('sorts todos correctly', async () => {
    await act(async () => {
      store.dispatch(resetStore())
      store.dispatch({
        type: 'todos/addTodo',
        payload: {
          id: '1',
          title: 'B Todo',
          completed: false,
          createdAt: new Date().toISOString(),
        },
      })
      store.dispatch({
        type: 'todos/addTodo',
        payload: {
          id: '2',
          title: 'A Todo',
          completed: true,
          createdAt: new Date().toISOString(),
        },
      })
    })

    renderWithRedux(<TodosPage />)
    
    await act(async () => {
      store.dispatch(setSortField('title'))
      store.dispatch(setSortOrder('asc'))
    })

    const todoItems = screen.getAllByTestId(/todo-item-/)
    expect(todoItems[0]).toHaveTextContent('A Todo')
    expect(todoItems[1]).toHaveTextContent('B Todo')
  })
}) 