import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Card, 
  CardContent,
  Stack
} from '@mui/material'
import { RestaurantMenu, Group, Poll, History } from '@mui/icons-material'
import Link from 'next/link'

export default function HomePage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h2" component="h1" gutterBottom>
          🍽️ Team Lunch App
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Help your team decide where to go for lunch quickly and fairly
        </Typography>
        <Button 
          variant="contained" 
          size="large"
          component={Link}
          href="/teams"
          sx={{ mt: 2 }}
        >
          Get Started
        </Button>
      </Box>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        <Card>
          <CardContent>
            <Group sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Create Teams
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Set up your team with a meeting point and invite colleagues
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <RestaurantMenu sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Discover Places
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Search restaurants by name or cuisine with smart constraints
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Poll sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Vote Together
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Quick polls with walking time, dietary needs, and recency filters
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <History sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Track History
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Remember where you've been and avoid repeats
            </Typography>
          </CardContent>
        </Card>
      </Stack>

      <Box mt={6} textAlign="center">
        <Typography variant="body2" color="text.secondary">
          Status: 🚧 In Development - Epic A: Teams & Membership
        </Typography>
      </Box>
    </Container>
  )
}