import { render, screen } from '@testing-library/react'
import Home from './page'
import '@testing-library/jest-dom'

jest.mock('@/components/ThemeProvider', () => ({
  useTheme: () => ({ theme: 'light' }),
}))


jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

describe('Home', () => {
  it('renders the main heading', () => {
    render(<Home />)
    expect(screen.getByText('Organize Your Life')).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    render(<Home />)
    expect(screen.getByText('Try demo')).toHaveAttribute('href', '/todos')
    expect(screen.getByText('Open tasks')).toHaveAttribute('href', '/todos')
  })

  it('renders all feature cards', () => {
    render(<Home />)
    expect(screen.getByText('Simple & Clean')).toBeInTheDocument()
    expect(screen.getByText('Stay Organized')).toBeInTheDocument()
    expect(screen.getByText('Try It Freely')).toBeInTheDocument()
  })

  it('renders feature descriptions', () => {
    render(<Home />)
    expect(screen.getByText('Focus on what matters with our minimalist design.')).toBeInTheDocument()
    expect(screen.getByText('Keep track of your tasks with our powerful organization tools.')).toBeInTheDocument()
    expect(screen.getByText('Try the task workflow without signing up. Data stays in this session.')).toBeInTheDocument()
  })

  it('renders the get started button', () => {
    render(<Home />)
    const getStartedButton = screen.getByText('Get Started')
    expect(getStartedButton).toBeInTheDocument()
    expect(getStartedButton).toHaveAttribute('href', '/todos')
  })

  it('renders the app description', () => {
    render(<Home />)
    expect(screen.getByText('A frontend demo for creating, filtering, and sorting tasks. No account needed. Tasks reset when you reload.')).toBeInTheDocument()
  })

  it('renders the logo with correct link', () => {
    render(<Home />)
    const logo = screen.getByText('TodoApp')
    expect(logo).toBeInTheDocument()
    expect(logo.closest('a')).toHaveAttribute('href', '/')
  })

  it('renders all SVG icons in feature cards', () => {
    render(<Home />)
    const svgs = document.querySelectorAll('svg')
    expect(svgs).toHaveLength(3)
  })
}) 