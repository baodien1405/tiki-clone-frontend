import { beforeAll, describe, expect, it } from 'vitest'
import { fireEvent, screen, waitFor } from '@testing-library/react'

import { path } from '@/constants'
import { renderWithRouter } from '@/utils'

describe('Login', () => {
  let emailInput: HTMLInputElement
  let passwordInput: HTMLInputElement
  let submitButton: HTMLButtonElement

  beforeAll(async () => {
    renderWithRouter({ route: path.login })
    await waitFor(() => {
      expect(screen.queryByPlaceholderText('Your E-mail address')).toBeInTheDocument()
      expect(screen.queryByPlaceholderText('Your password')).toBeInTheDocument()
    })
    emailInput = document.querySelector('form input[id="email"]') as HTMLInputElement
    passwordInput = document.querySelector('form input[id="password"]') as HTMLInputElement
    submitButton = document.querySelector('form button[type="submit"]') as HTMLButtonElement
  })

  it('should display an error when nothing is entered', async () => {
    fireEvent.submit(submitButton)
    await waitFor(() => {
      expect(screen.queryByText('Please enter an email')).toBeTruthy()
      expect(screen.queryByText('Please enter a password')).toBeTruthy()
    })
  })

  it('should display an error when entering incorrect input value', async () => {
    fireEvent.change(emailInput, {
      target: {
        value: 'test@'
      }
    })
    fireEvent.change(passwordInput, {
      target: {
        value: '1234'
      }
    })
    fireEvent.submit(submitButton)
    await waitFor(() => {
      expect(screen.queryByText('Please enter a valid email')).toBeTruthy()
      expect(screen.queryByText('Length from 6 - 160 characters')).toBeTruthy()
    })
  })

  it('should not display an error when re-entering the correct value', async () => {
    fireEvent.change(emailInput, {
      target: {
        value: 'capbaodien999@gmail.com'
      }
    })
    fireEvent.change(passwordInput, {
      target: {
        value: '123456'
      }
    })
    await waitFor(() => {
      expect(screen.queryByText('Please enter a valid email')).toBeFalsy()
      expect(screen.queryByText('Length from 6 - 160 characters')).toBeFalsy()
    })
    fireEvent.submit(submitButton)
    // screen.debug(document.body.parentElement as HTMLElement, 999999999)
  })
})
