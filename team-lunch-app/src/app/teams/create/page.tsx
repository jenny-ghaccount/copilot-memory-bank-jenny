import { 
  Container, 
  Typography, 
  Box,
  Breadcrumbs,
  Link,
  Paper
} from '@mui/material'
import NextLink from 'next/link'
import { Home, Group } from '@mui/icons-material'
import { CreateTeamForm } from '@/components/CreateTeamForm'

export default function CreateTeamPage() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link 
          component={NextLink} 
          href="/" 
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
        >
          <Home fontSize="small" />
          Home
        </Link>
        <Link 
          component={NextLink} 
          href="/teams" 
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
        >
          <Group fontSize="small" />
          Teams
        </Link>
        <Typography color="text.primary">Create Team</Typography>
      </Breadcrumbs>

      <Typography variant="h4" component="h1" gutterBottom>
        Create New Team
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Set up your team for lunch coordination. Define your meeting point and preferences to get personalized restaurant suggestions.
      </Typography>

      <CreateTeamForm />
    </Container>
  )
}