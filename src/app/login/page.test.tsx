import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginPage from './page'
import { login } from '@/lib/auth'
import '@testing-library/jest-dom'
import { act } from 'react'

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

jest.mock('@/lib/auth', () => ({
  login: jest.fn(),
}))

describe('LoginPage', () => {
  beforeEach(() => {
    (login as jest.Mock).mockReset()
  })

  it('renders login form', () => {
    render(<LoginPage />)
    
    expect(screen.getByText('Welcome Back')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('shows validation errors for invalid input', async () => {
    render(<LoginPage />)
    
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    await act(async () => {
      await userEvent.click(submitButton)
    })

    expect(screen.getByText('Invalid email address')).toBeInTheDocument()
    expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument()
  })

  it('handles successful login', async () => {
    (login as jest.Mock).mockResolvedValueOnce({ success: true })
    
    render(<LoginPage />)
    
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    await act(async () => {
      await userEvent.type(emailInput, 'test@example.com')
      await userEvent.type(passwordInput, 'password123')
      await userEvent.click(submitButton)
    })

    expect(login).toHaveBeenCalledWith('test@example.com', 'password123')
  })

  it('handles login error', async () => {
    (login as jest.Mock).mockRejectedValueOnce(new Error('Login failed'))
    
    render(<LoginPage />)
    
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    await act(async () => {
      await userEvent.type(emailInput, 'test@example.com')
      await userEvent.type(passwordInput, 'password123')
      await userEvent.click(submitButton)
    })

    expect(screen.getByText('Invalid email or password')).toBeInTheDocument()
  })

  it('shows loading state during form submission', async () => {
    let resolveLogin: (value: { success: true }) => void
    (login as jest.Mock).mockImplementation(() => new Promise(resolve => {
      resolveLogin = resolve
    }))
    
    render(<LoginPage />)
    
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    await act(async () => {
      await userEvent.type(emailInput, 'test@example.com')
      await userEvent.type(passwordInput, 'password123')
      await userEvent.click(submitButton)
    })

    expect(submitButton).toBeDisabled()
    expect(submitButton.querySelector('.animate-spin')).toBeInTheDocument()

    await act(async () => {
      resolveLogin({ success: true })
    })
  })

  it('renders navigation links', () => {
    render(<LoginPage />)
    
    const homeLink = screen.getByText('TodoApp')
    const signupLink = screen.getByText('Sign up')

    expect(homeLink.closest('a')).toHaveAttribute('href', '/')
    expect(signupLink).toHaveAttribute('href', '/signup')
  })

  it('maintains form state during input', async () => {
    render(<LoginPage />)
    
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')

    await act(async () => {
      await userEvent.type(emailInput, 'test@example.com')
      await userEvent.type(passwordInput, 'password123')
    })

    expect(emailInput).toHaveValue('test@example.com')
    expect(passwordInput).toHaveValue('password123')
  })
}) 