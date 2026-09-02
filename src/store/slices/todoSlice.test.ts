import todoReducer, { addTodo, toggleTodo, deleteTodo, setFilter, setSearchQuery, setSortField, setSortOrder, editTodo, clearCompleted, toggleAll, resetStore } from './todoSlice'

describe('todoSlice', () => {
  const initialState: ReturnType<typeof todoReducer> = {
    todos: [],
    filter: 'all',
    searchQuery: '',
    sortField: 'createdAt',
    sortOrder: 'asc'
  }

  it('should handle initial state', () => {
    expect(todoReducer(undefined, { type: 'unknown' })).toEqual(initialState)
  })

  it('should handle addTodo', () => {
    const todo = {
      id: '1',
      title: 'Test Todo',
      completed: false,
      createdAt: new Date().toISOString()
    }
    const nextState = todoReducer(initialState, addTodo(todo))
    expect(nextState.todos).toEqual([todo])
  })

  it('should handle toggleTodo', () => {
    const todo = {
      id: '1',
      title: 'Test Todo',
      completed: false,
      createdAt: new Date().toISOString()
    }
    const state: ReturnType<typeof todoReducer> = {
      ...initialState,
      todos: [todo]
    }
    const nextState = todoReducer(state, toggleTodo('1'))
    expect(nextState.todos[0].completed).toBe(true)
  })

  it('should handle deleteTodo', () => {
    const todo = {
      id: '1',
      title: 'Test Todo',
      completed: false,
      createdAt: new Date().toISOString()
    }
    const state: ReturnType<typeof todoReducer> = {
      ...initialState,
      todos: [todo]
    }
    const nextState = todoReducer(state, deleteTodo('1'))
    expect(nextState.todos).toEqual([])
  })

  it('should handle setFilter', () => {
    const nextState = todoReducer(initialState, setFilter('completed'))
    expect(nextState.filter).toBe('completed')
  })

  it('should handle setSearchQuery', () => {
    const nextState = todoReducer(initialState, setSearchQuery('test'))
    expect(nextState.searchQuery).toBe('test')
  })

  it('should handle setSortField', () => {
    const nextState = todoReducer(initialState, setSortField('title'))
    expect(nextState.sortField).toBe('title')
  })

  it('should handle setSortOrder', () => {
    const nextState = todoReducer(initialState, setSortOrder('desc'))
    expect(nextState.sortOrder).toBe('desc')
  })

  it('should handle editTodo', () => {
    const todo = {
      id: '1',
      title: 'Test Todo',
      completed: false,
      createdAt: new Date().toISOString()
    }
    const state: ReturnType<typeof todoReducer> = {
      ...initialState,
      todos: [todo]
    }
    const nextState = todoReducer(state, editTodo({ 
      id: '1', 
      title: 'Updated Todo',
      description: 'New description'
    }))
    expect(nextState.todos[0].title).toBe('Updated Todo')
    expect(nextState.todos[0].description).toBe('New description')
    expect(nextState.todos[0].updatedAt).toBeDefined()
  })

  it('should handle clearCompleted', () => {
    const todos = [
      {
        id: '1',
        title: 'Active Todo',
        completed: false,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Completed Todo',
        completed: true,
        createdAt: new Date().toISOString()
      }
    ]
    const state: ReturnType<typeof todoReducer> = {
      ...initialState,
      todos
    }
    const nextState = todoReducer(state, clearCompleted())
    expect(nextState.todos).toHaveLength(1)
    expect(nextState.todos[0].title).toBe('Active Todo')
  })

  it('should handle toggleAll', () => {
    const todos = [
      {
        id: '1',
        title: 'Todo 1',
        completed: false,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Todo 2',
        completed: false,
        createdAt: new Date().toISOString()
      }
    ]
    const state: ReturnType<typeof todoReducer> = {
      ...initialState,
      todos
    }
    const nextState = todoReducer(state, toggleAll())
    expect(nextState.todos.every(todo => todo.completed)).toBe(true)
    expect(nextState.todos.every(todo => todo.updatedAt)).toBe(true)

    const nextState2 = todoReducer(nextState, toggleAll())
    expect(nextState2.todos.every(todo => !todo.completed)).toBe(true)
  })

  it('should handle resetStore', () => {
    const state: ReturnType<typeof todoReducer> = {
      todos: [
        {
          id: '1',
          title: 'Test Todo',
          completed: true,
          createdAt: new Date().toISOString()
        }
      ],
      filter: 'completed',
      searchQuery: 'test',
      sortField: 'title',
      sortOrder: 'desc'
    }
    const nextState = todoReducer(state, resetStore())
    expect(nextState).toEqual(initialState)
  })
}) 