import { render, screen, fireEvent } from '@/utils/test-utils'
import TodoItem from '@/components/TodoItem'
import '@testing-library/jest-dom'
import { RootState } from '@/store/store'
import userEvent from '@testing-library/user-event'
import { act } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '@/store/store'

interface Todo {
  id: string
  title: string
  completed: boolean
  createdAt: string
  description: string
}

describe('TodoItem', () => {
  const mockTodo: Todo = {
    id: '1',
    title: 'Test Todo',
    completed: false,
    createdAt: new Date().toISOString(),
    description: 'Test Description',
  }

  const initialState: RootState = {
    todos: {
      todos: [mockTodo],
      filter: 'all',
      searchQuery: '',
      sortField: 'createdAt',
      sortOrder: 'desc',
    },
  }

  const renderWithRedux = (component: React.ReactElement) => {
    return render(
      <Provider store={store}>
        {component}
      </Provider>
    )
  }

  it('renders the todo item correctly', () => {
    render(<TodoItem todo={mockTodo} />, { preloadedState: initialState })

    expect(screen.getByText('Test Todo')).toBeInTheDocument()
    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })

  it('calls onToggle when checkbox is clicked', async () => {
    const { store } = render(<TodoItem todo={mockTodo} />, { preloadedState: initialState })

    const checkbox = screen.getByRole('checkbox')
    await act(async () => {
      fireEvent.click(checkbox)
    })

    const state = store.getState() as RootState
    expect(state.todos.todos[0].completed).toBe(true)
  })

  it('calls onDelete when delete button is clicked', async () => {
    const { store } = render(<TodoItem todo={mockTodo} />, { preloadedState: initialState })

    const deleteButton = screen.getByRole('button', { name: /delete/i })
    await act(async () => {
      fireEvent.click(deleteButton)
    })

    const state = store.getState() as RootState
    expect(state.todos.todos).toHaveLength(0)
  })

  it('shows completed state correctly', () => {
    const completedTodo: Todo = { ...mockTodo, completed: true }
    const completedState: RootState = {
      todos: {
        ...initialState.todos,
        todos: [completedTodo],
      },
    }
    
    render(<TodoItem todo={completedTodo} />, { preloadedState: completedState })

    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('enters edit mode when edit button is clicked', async () => {
    render(<TodoItem todo={mockTodo} />, { preloadedState: initialState })

    const editButton = screen.getByRole('button', { name: /edit/i })
    await act(async () => {
      fireEvent.click(editButton)
    })

    expect(screen.getByDisplayValue('Test Todo')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument()
  })

  it('shows error when trying to save empty title', async () => {
    render(<TodoItem todo={mockTodo} />, { preloadedState: initialState })

    const editButton = screen.getByRole('button', { name: /edit/i })
    await act(async () => {
      fireEvent.click(editButton)
    })

    const titleInput = screen.getByDisplayValue('Test Todo')
    await act(async () => {
      await userEvent.clear(titleInput)
    })

    const saveButton = screen.getByRole('button', { name: /save changes/i })
    await act(async () => {
      fireEvent.click(saveButton)
    })

    expect(screen.getByText('Title cannot be empty')).toBeInTheDocument()
  })

  it('saves edited todo when save button is clicked', async () => {
    const { store } = render(<TodoItem todo={mockTodo} />, { preloadedState: initialState })

    const editButton = screen.getByRole('button', { name: /edit/i })
    await act(async () => {
      fireEvent.click(editButton)
    })

    const titleInput = screen.getByDisplayValue('Test Todo')
    await act(async () => {
      await userEvent.clear(titleInput)
      await userEvent.type(titleInput, 'Updated Todo')
    })

    const saveButton = screen.getByRole('button', { name: /save changes/i })
    await act(async () => {
      fireEvent.click(saveButton)
    })

    const state = store.getState() as RootState
    expect(state.todos.todos[0].title).toBe('Updated Todo')
  })

  it('cancels edit mode when cancel button is clicked', async () => {
    render(<TodoItem todo={mockTodo} />, { preloadedState: initialState })

    const editButton = screen.getByRole('button', { name: /edit/i })
    await act(async () => {
      fireEvent.click(editButton)
    })

    const titleInput = screen.getByDisplayValue('Test Todo')
    await act(async () => {
      await userEvent.clear(titleInput)
      await userEvent.type(titleInput, 'Updated Todo')
    })

    const cancelButton = screen.getByRole('button', { name: /cancel editing/i })
    await act(async () => {
      fireEvent.click(cancelButton)
    })

    expect(screen.getByText('Test Todo')).toBeInTheDocument()
    expect(screen.queryByDisplayValue('Updated Todo')).not.toBeInTheDocument()
  })

  it('toggles description visibility when title is clicked', async () => {
    render(<TodoItem todo={mockTodo} />, { preloadedState: initialState })

    const title = screen.getByText('Test Todo')
    await act(async () => {
      fireEvent.click(title)
    })

    expect(screen.getByText('Test Description')).toBeInTheDocument()

    await act(async () => {
      fireEvent.click(title)
    })
    expect(screen.queryByText('Test Description')).not.toBeInTheDocument()
  })

  it('handles keyboard events in edit mode', async () => {
    const { store, rerender } = render(<TodoItem todo={mockTodo} />, { preloadedState: initialState })

    const editButton = screen.getByRole('button', { name: /edit/i })
    await act(async () => {
      fireEvent.click(editButton)
    })

    const titleInput = screen.getByDisplayValue('Test Todo')
    await act(async () => {
      await userEvent.clear(titleInput)
      await userEvent.type(titleInput, 'Updated Todo')
    })

    await act(async () => {
      fireEvent.keyDown(titleInput, { key: 'Enter' })
    })
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    const updatedState = store.getState() as RootState
    rerender(<TodoItem todo={updatedState.todos.todos[0]} />)
    
    expect(updatedState.todos.todos[0].title).toBe('Updated Todo')
    expect(screen.queryByDisplayValue('Updated Todo')).not.toBeInTheDocument()
    expect(screen.getByText('Updated Todo')).toBeInTheDocument()

    await act(async () => {
      fireEvent.click(editButton)
    })
    const newTitleInput = screen.getByDisplayValue('Updated Todo')
    await act(async () => {
      await userEvent.clear(newTitleInput)
      await userEvent.type(newTitleInput, 'Another Update')
      fireEvent.keyDown(newTitleInput, { key: 'Escape' })
    })
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    const finalState = store.getState() as RootState
    rerender(<TodoItem todo={finalState.todos.todos[0]} />)
    
    expect(screen.queryByDisplayValue('Another Update')).not.toBeInTheDocument()
    expect(screen.getByText('Updated Todo')).toBeInTheDocument()

    await act(async () => {
      fireEvent.click(editButton)
    })
    const finalTitleInput = screen.getByDisplayValue('Updated Todo')
    await act(async () => {
      await userEvent.clear(finalTitleInput)
      await userEvent.type(finalTitleInput, 'Shift Enter Test')
      fireEvent.keyDown(finalTitleInput, { key: 'Enter', shiftKey: true })
    })
    
    expect(screen.getByDisplayValue('Shift Enter Test')).toBeInTheDocument()
    expect(screen.queryByText('Shift Enter Test')).not.toBeInTheDocument()
  })

  it('renders correctly', () => {
    const { container } = renderWithRedux(
      <TodoItem todo={mockTodo} />
    )
    expect(container).toMatchSnapshot()
  })

  it('renders completed todo correctly', () => {
    const { container } = renderWithRedux(
      <TodoItem todo={{ ...mockTodo, completed: true }} />
    )
    expect(container).toMatchSnapshot()
  })

  it('renders in edit mode correctly', () => {
    const { container } = renderWithRedux(
      <TodoItem todo={mockTodo} />
    )
    const editButton = screen.getByRole('button', { name: /edit/i })
    fireEvent.click(editButton)
    expect(container).toMatchSnapshot()
  })
}) 