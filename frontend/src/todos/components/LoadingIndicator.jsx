import { Box, CircularProgress } from '@mui/material'

export const LoadingIndicator = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
    <CircularProgress size={30} aria-label='Loading' />
  </Box>
)
