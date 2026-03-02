import { 
  Container, 
  Typography, 
  Button, 
  Box,
  Alert
} from '@mui/material'
import { Add } from '@mui/icons-material'
import Link from 'next/link'

export default function TeamsPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Your Teams
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          component={Link}
          href="/teams/create"
        >
          Create Team
        </Button>
      </Box>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        🚧 Epic A1: Team Creation - In Development
        <br />
        Next: Set up database and authentication
      </Alert>

      <Typography variant="body1" color="text.secondary">
        You don't have any teams yet. Create your first team to get started!
      </Typography>
      
      <Box mt={4}>
        <Button component={Link} href="/" variant="outlined">
          ← Back to Home
        </Button>
      </Box>
    </Container>
  )
}