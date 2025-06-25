import {
  Box,
  Container,
  Typography,
  Stack
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR as ptBRLocale } from 'date-fns/locale';
import { useFiretrack } from '../store/FiretrackContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BaseNavigationButtons from '../components/BaseNavigationButtons';

export default function SelecionePeriodo() {
  const { period, setPeriod } = useFiretrack();
  const [start, setStart] = useState<Date | null>(period.start ? new Date(period.start) : null);
  const [end, setEnd] = useState<Date | null>(period.end ? new Date(period.end) : null);
  const navigate = useNavigate();

  const handleNext = () => {
    if (start && end) {
      setPeriod({ start: start.toISOString(), end: end.toISOString() });
      navigate('/selecione-aoi');
    }
  };

  const handlePrevious = () => {
    navigate('/selecione-produto');
  };

  const isInvalid = !start || !end || start >= end;

  return (
    <Box sx={{ minHeight: '100vh', py: 6 }}>
      <Container>
        <Typography variant="h6" color="primary" mb={4}>
          2. Selecione o período
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBRLocale}>
          <Stack alignItems="center" spacing={4} direction="column" width="100%">
            <DateTimePicker
              label="Data inicial"
              value={start}
              onChange={(newValue) => setStart(newValue)}
              slotProps={{ textField: { fullWidth: true, sx: { backgroundColor: '#fff' } } }}
            />

            <DateTimePicker
              label="Data final"
              value={end}
              onChange={(newValue) => setEnd(newValue)}
              slotProps={{ textField: { fullWidth: true, sx: { backgroundColor: '#fff' } } }}
            />
          </Stack>
        </LocalizationProvider>

        <BaseNavigationButtons
          hasToStart
          previousHandler={handlePrevious}
          nextHandler={handleNext}
          nextValidator={isInvalid}
        />
      </Container>
    </Box>
  );
}
