'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material'
import { Email } from '@mui/icons-material'

export function SignInForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/teams'
  const authError = searchParams.get('error')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    
    if (!email.trim()) {
      setError('Email is required')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await signIn('email', {
        email: email.trim(),
        callbackUrl,
        redirect: false,
      })

      if (result?.error) {
        setError('Failed to send sign-in email. Please try again.')
      } else {
        setSent(true)
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <Box textAlign="center">
        <Email sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Check your email
        </Typography>
        <Typography color="text.secondary" paragraph>
          We sent a sign-in link to <strong>{email}</strong>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Click the link in your email to sign in. You can close this tab.
        </Typography>
        <Button 
          variant="outlined" 
          onClick={() => setSent(false)}
          sx={{ mt: 2 }}
        >
          Send to different email
        </Button>
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Sign In
      </Typography>
      
      <Typography color="text.secondary" paragraph>
        Enter your email address and we'll send you a link to sign in.
      </Typography>

      {authError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {authError === 'Configuration' && 'There was a problem with the server configuration.'}
          {authError === 'Verification' && 'The sign in link is no longer valid. Please request a new one.'}
          {authError === 'Default' && 'An error occurred during sign in. Please try again.'}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          type="email"
          label="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          disabled={loading}
          sx={{ mb: 3 }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : <Email />}
        >
          {loading ? 'Sending...' : 'Send sign-in link'}
        </Button>
      </Box>

      <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
        By signing in, you agree to our terms and privacy policy.
      </Typography>
    </Box>
  )
}