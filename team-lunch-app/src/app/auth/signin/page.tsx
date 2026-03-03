import { 
  Container, 
  Typography, 
  Card,
  CardContent,
  Box
} from '@mui/material'
import { SignInForm } from '@/components/auth/SignInForm'

export default function SignInPage() {
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" component="h1" gutterBottom>
          🍽️
        </Typography>
        <Typography variant="h4" component="h1" gutterBottom>
          Team Lunch App
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Sign in to coordinate lunch with your team
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <SignInForm />
        </CardContent>
      </Card>
    </Container>
  )
}