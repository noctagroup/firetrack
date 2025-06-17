import { Box, Typography, Modal, CircularProgress, Alert } from '@mui/material';
import { useLoading } from '../store/LoadingContext';

export default function LoadingComponent({children}) {
  const { loading, error } = useLoading();

  return (
    <>
    <Modal open={loading || !!error} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box
        sx={{
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          outline: 'none',
          minWidth: 300,
        }}
      >
        {loading && (
          <>
            <CircularProgress color="primary" sx={{ mb: 2 }} />
            <Typography variant="h6" color="primary">
              Carregando...
            </Typography>
          </>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Box>
    </Modal>
    {children}
    </>
  );
}