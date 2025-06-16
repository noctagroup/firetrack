import {
  Box,
  Container,
  Typography,
  Stack,
  TextField
} from '@mui/material';
import { useFiretrack } from '../store/FiretrackContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BaseNavigationButtons from '../components/BaseNavigationButtons';

export default function SelecionePeriodo() {
  const { period, setPeriod } = useFiretrack();
  const [start, setStart] = useState(period.start || '');
  const [end, setEnd] = useState(period.end || '');
  const navigate = useNavigate();

  const handleNext = () => {
    setPeriod({ start, end });
    navigate('/selecione-aoi');
  };

  const handlePrevious = () => {
    navigate('/selecione-produto')
  }

  return (
    <Box sx={{ minHeight: '100vh', py: 6 }}>
      <Container>
        <Typography variant="h6" color="primary" mb={4}>
          2. Selecione o período
        </Typography>
        <Stack alignItems="center" spacing={4} direction="column" width="100%">
          <TextField
            fullWidth
            label="Data inicial"
            type="datetime-local"
            InputLabelProps={{ shrink: true }}
            InputProps={{
              sx: { backgroundColor: '#fff' }
            }}
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />


          <TextField
            fullWidth
            label="Data final"
            type="datetime-local"
            InputLabelProps={{ shrink: true }}
            InputProps={{
              sx: { backgroundColor: '#fff' }
            }}
            value={end}
            onChange={(e) => setEnd(e.target.value)}
          />
        </Stack>

        <BaseNavigationButtons
          hasToStart
          previousHandler={handlePrevious}
          nextHandler={handleNext}
          nextValidator={!start || !end || new Date(start) >= new Date(end)}
        />
      </Container>
    </Box>
  );
}