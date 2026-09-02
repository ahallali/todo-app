import { render, screen, fireEvent } from '@testing-library/react'
import ThemeButton from './ThemeButton'
import '@testing-library/jest-dom'
import { ThemeProvider } from './ThemeProvider'
import { useTheme } from './ThemeProvider'

jest.mock('./ThemeProvider', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useTheme: jest.fn(() => ({
    theme: 'light',
    ButtonTheme: jest.fn(),
  })),
}))

describe('ThemeButton', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders theme button with correct initial icon', () => {
    render(
      <ThemeProvider>
        <ThemeButton />
      </ThemeProvider>
    )
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('aria-label', 'Toggle theme')
  })

  it('toggles theme when clicked', () => {
    const mockButtonTheme = jest.fn()
    jest.mocked(useTheme).mockReturnValue({
      theme: 'light',
      ButtonTheme: mockButtonTheme,
    })

    render(
      <ThemeProvider>
        <ThemeButton />
      </ThemeProvider>
    )
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(mockButtonTheme).toHaveBeenCalled()
  })

  it('renders sun icon in dark theme', () => {
    jest.mocked(useTheme).mockReturnValue({
      theme: 'dark',
      ButtonTheme: jest.fn(),
    })

    render(
      <ThemeProvider>
        <ThemeButton />
      </ThemeProvider>
    )
    
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    const sunIcon = button.querySelector('path[d*="M12 3v1m0 16v1m9-9h-1M4"]')
    expect(sunIcon).toBeInTheDocument()
  })

  it('renders moon icon in light theme', () => {
    jest.mocked(useTheme).mockReturnValue({
      theme: 'light',
      ButtonTheme: jest.fn(),
    })

    render(
      <ThemeProvider>
        <ThemeButton />
      </ThemeProvider>
    )
    
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    const moonIcon = button.querySelector('path[d*="M20.354 15.354A9 9 0"]')
    expect(moonIcon).toBeInTheDocument()
  })
}) 