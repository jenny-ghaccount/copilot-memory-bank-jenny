'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Slider,
  Switch,
  TextField,
  Typography,
  Alert,
  Divider,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { LocationOn as MapPin, Save } from '@mui/icons-material'
import { MapPicker } from './MapPicker'

interface Location {
  lat: number
  lng: number
  address?: string
}

interface FormData {
  name: string
  meetingPoint?: Location
  maxWalkMinutes: number
  avoidRecentDays: number
  requireDietaryMatch: boolean
}

export function CreateTeamForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    maxWalkMinutes: 15,
    avoidRecentDays: 14,
    requireDietaryMatch: true,
  })

  const handleInputChange = (field: keyof FormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }))
  }

  const handleLocationChange = (location: Location) => {
    setFormData(prev => ({
      ...prev,
      meetingPoint: location,
    }))
  }

  const handleSliderChange = (field: 'maxWalkMinutes' | 'avoidRecentDays') => (
    _: Event,
    value: number | number[]
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: Array.isArray(value) ? value[0] : value,
    }))
  }

  const handleSwitchChange = (field: keyof FormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.checked,
    }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    
    if (!formData.name.trim()) {
      setError('Team name is required')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          meetingPoint: formData.meetingPoint,
          settings: {
            maxWalkMinutes: formData.maxWalkMinutes,
            avoidRecentDays: formData.avoidRecentDays,
            requireDietaryMatch: formData.requireDietaryMatch,
          },
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create team')
      }

      // Redirect to the new team
      router.push(`/teams/${data.team.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create team')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Basic Information
          </Typography>
          
          <TextField
            fullWidth
            label="Team Name"
            value={formData.name}
            onChange={handleInputChange('name')}
            placeholder="e.g., Frontend Team Lunch"
            required
            sx={{ mb: 3 }}
          />

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Meeting Point
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Click on the map to set your team's meeting point. This will be used to calculate walking distances to restaurants.
          </Typography>
          
          <MapPicker 
            value={formData.meetingPoint}
            onChange={handleLocationChange}
            height={300}
          />

          {formData.meetingPoint && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MapPin fontSize="small" />
                Location: {formData.meetingPoint.lat.toFixed(4)}, {formData.meetingPoint.lng.toFixed(4)}
              </Typography>
            </Box>
          )}
          
          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Team Preferences
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <FormLabel>Maximum Walking Time</FormLabel>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {formData.maxWalkMinutes} minutes
                </Typography>
                <Slider
                  value={formData.maxWalkMinutes}
                  onChange={handleSliderChange('maxWalkMinutes')}
                  min={5}
                  max={30}
                  step={5}
                  marks={[
                    { value: 5, label: '5 min' },
                    { value: 15, label: '15 min' },
                    { value: 30, label: '30 min' },
                  ]}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <FormLabel>Avoid Recent Places</FormLabel>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Don't repeat restaurants within {formData.avoidRecentDays} days
                </Typography>
                <Slider
                  value={formData.avoidRecentDays}
                  onChange={handleSliderChange('avoidRecentDays')}
                  min={0}
                  max={30}
                  step={7}
                  marks={[
                    { value: 0, label: 'Off' },
                    { value: 7, label: '1w' },
                    { value: 14, label: '2w' },
                    { value: 30, label: '1m' },
                  ]}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.requireDietaryMatch}
                    onChange={handleSwitchChange('requireDietaryMatch')}
                  />
                }
                label="Consider dietary restrictions when suggesting restaurants"
              />
            </Grid>
          </Grid>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button 
              variant="outlined" 
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancel
            </Button>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={loading}
              startIcon={<Save />}
            >
              Create Team
            </LoadingButton>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}