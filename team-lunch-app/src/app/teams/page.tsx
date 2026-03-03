'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  Container, 
  Typography, 
  Button, 
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material'
import { Add, Group, Person, Poll } from '@mui/icons-material'
import Link from 'next/link'

interface Team {
  id: string
  name: string
  userRole: 'ORGANIZER' | 'MEMBER'
  members: Array<{
    id: string
    name: string | null
    email: string
    role: 'ORGANIZER' | 'MEMBER'
  }>
  _count: {
    members: number
    polls: number
  }
  createdAt: string
}

export default function TeamsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'loading') return
    
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/teams')
      return
    }

    fetchTeams()
  }, [status, router])

  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/teams')
      
      if (!response.ok) {
        throw new Error('Failed to fetch teams')
      }

      const data = await response.json()
      setTeams(data.teams)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch teams')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Your Teams
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back, {session?.user?.name || session?.user?.email}!
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          component={Link}
          href="/teams/create"
        >
          Create Team
        </Button>
      </Box>

      {teams.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Group sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No teams yet
            </Typography>
            <Typography color="text.secondary" paragraph>
              Create your first team to start coordinating lunch decisions with your colleagues.
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<Add />}
              component={Link}
              href="/teams/create"
            >
              Create Your First Team
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {teams.map((team) => (
            <Grid item xs={12} md={6} lg={4} key={team.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                    <Typography variant="h6" component="h2">
                      {team.name}
                    </Typography>
                    <Chip 
                      label={team.userRole} 
                      color={team.userRole === 'ORGANIZER' ? 'primary' : 'default'}
                      size="small"
                    />
                  </Box>
                  
                  <Box display="flex" alignItems="center" gap={2} mb={1}>
                    <Person fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {team._count.members} member{team._count.members !== 1 ? 's' : ''}
                    </Typography>
                  </Box>
                  
                  <Box display="flex" alignItems="center" gap={2}>
                    <Poll fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {team._count.polls} poll{team._count.polls !== 1 ? 's' : ''}
                    </Typography>
                  </Box>
                </CardContent>
                
                <CardActions>
                  <Button 
                    size="small" 
                    component={Link} 
                    href={`/teams/${team.id}`}
                    fullWidth
                  >
                    Open Team
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  )
}