import { 
  Container, 
  Typography, 
  Box,
  Alert,
  Button
} from '@mui/material'
import Link from 'next/link'

export default function CreateTeamPage() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Create New Team
      </Typography>
      
      <Alert severity="warning" sx={{ mb: 3 }}>
        🚧 Team Creation Form - Coming Next!
        <br />
        This will include: Team name input, Meeting point map picker, Member invitation
      </Alert>

      <Typography variant="body1" color="text.secondary" paragraph>
        The team creation form will be implemented once we set up:
      </Typography>
      
      <ul style={{ marginLeft: '20px', marginBottom: '20px' }}>
        <li>Supabase database connection</li>
        <li>Authentication with Auth.js</li>
        <li>Leaflet map component for meeting point</li>
        <li>Form validation with Zod</li>
      </ul>

      <Box>
        <Button component={Link} href="/teams" variant="outlined">
          ← Back to Teams
        </Button>
      </Box>
    </Container>
  )
}