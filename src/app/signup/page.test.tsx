import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SignUpPage from './page'
import { signup } from '@/lib/auth'
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
  signup: jest.fn(),
}))

describe('SignUpPage', () => {
  beforeEach(() => {
    (signup as jest.Mock).mockReset()
  })

  it('renders signup form', () => {
    render(<SignUpPage />)
    
    expect(screen.getByRole('heading', { name: 'Create Account' })).toBeInTheDocument()
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument()
  })

  it('shows validation errors for invalid input', async () => {
    render(<SignUpPage />)
    
    const submitButton = screen.getByRole('button', { name: /create account/i })
    await act(async () => {
      await userEvent.click(submitButton)
    })

    expect(screen.getByText('Name is required')).toBeInTheDocument()
    expect(screen.getByText('Invalid email address')).toBeInTheDocument()
    expect(screen.getAllByText('Password must be at least 6 characters')).toHaveLength(2)
  })

  it('shows error for mismatched passwords', async () => {
    render(<SignUpPage />)
    
    const nameInput = screen.getByLabelText('Full Name')
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const confirmPasswordInput = screen.getByLabelText('Confirm Password')
    const submitButton = screen.getByRole('button', { name: /create account/i })

    await act(async () => {
      await userEvent.type(nameInput, 'Test User')
      await userEvent.type(emailInput, 'test@example.com')
      await userEvent.type(passwordInput, 'password123')
      await userEvent.type(confirmPasswordInput, 'password456')
      await userEvent.click(submitButton)
    })

    expect(screen.getByText("Passwords don't match")).toBeInTheDocument()
  })

  it('handles successful signup', async () => {
    (signup as jest.Mock).mockResolvedValueOnce({ success: true })
    
    render(<SignUpPage />)
    
    const nameInput = screen.getByLabelText('Full Name')
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const confirmPasswordInput = screen.getByLabelText('Confirm Password')
    const submitButton = screen.getByRole('button', { name: /create account/i })

    await act(async () => {
      await userEvent.type(nameInput, 'Test User')
      await userEvent.type(emailInput, 'test@example.com')
      await userEvent.type(passwordInput, 'password123')
      await userEvent.type(confirmPasswordInput, 'password123')
      await userEvent.click(submitButton)
    })

    expect(signup).toHaveBeenCalledWith('Test User', 'test@example.com', 'password123')
  })

  it('handles signup error', async () => {
    (signup as jest.Mock).mockRejectedValueOnce(new Error('Signup failed'))
    
    render(<SignUpPage />)
    
    const nameInput = screen.getByLabelText('Full Name')
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const confirmPasswordInput = screen.getByLabelText('Confirm Password')
    const submitButton = screen.getByRole('button', { name: /create account/i })

    await act(async () => {
      await userEvent.type(nameInput, 'Test User')
      await userEvent.type(emailInput, 'test@example.com')
      await userEvent.type(passwordInput, 'password123')
      await userEvent.type(confirmPasswordInput, 'password123')
      await userEvent.click(submitButton)
    })

    expect(screen.getByText('Failed to create account. Please try again.')).toBeInTheDocument()
  })

  it('shows loading state during form submission', async () => {
    let resolveSignup: (value: { success: true }) => void
    (signup as jest.Mock).mockImplementation(() => new Promise(resolve => {
      resolveSignup = resolve
    }))
    
    render(<SignUpPage />)
    
    const nameInput = screen.getByLabelText('Full Name')
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const confirmPasswordInput = screen.getByLabelText('Confirm Password')
    const submitButton = screen.getByRole('button', { name: /create account/i })

    await act(async () => {
      await userEvent.type(nameInput, 'Test User')
      await userEvent.type(emailInput, 'test@example.com')
      await userEvent.type(passwordInput, 'password123')
      await userEvent.type(confirmPasswordInput, 'password123')
      await userEvent.click(submitButton)
    })

    expect(submitButton).toBeDisabled()
    expect(submitButton.querySelector('.animate-spin')).toBeInTheDocument()

    await act(async () => {
      resolveSignup({ success: true })
    })
  })

  it('renders navigation links', () => {
    render(<SignUpPage />)
    
    const homeLink = screen.getByText('TodoApp')
    const loginLink = screen.getByText('Sign in')

    expect(homeLink.closest('a')).toHaveAttribute('href', '/')
    expect(loginLink).toHaveAttribute('href', '/login')
  })

  it('maintains form state during input', async () => {
    render(<SignUpPage />)
    
    const nameInput = screen.getByLabelText('Full Name')
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const confirmPasswordInput = screen.getByLabelText('Confirm Password')

    await act(async () => {
      await userEvent.type(nameInput, 'Test User')
      await userEvent.type(emailInput, 'test@example.com')
      await userEvent.type(passwordInput, 'password123')
      await userEvent.type(confirmPasswordInput, 'password123')
    })

    expect(nameInput).toHaveValue('Test User')
    expect(emailInput).toHaveValue('test@example.com')
    expect(passwordInput).toHaveValue('password123')
    expect(confirmPasswordInput).toHaveValue('password123')
  })
}) 