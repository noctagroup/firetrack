import { Box, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';

export default function BaseNavigationButtons({
  hasToStart,
  last = false,
  first = false,
  nextValidator = false,
  previousHandler,
  nextHandler,
}) {
  const navigate = useNavigate();

  const toStartHandler = () => {
    navigate('/processamentos');
  };

  return (
    <Box mt={6}>
      <Stack direction="row" spacing={2} justifyContent="center">
        {!first && (
          <Button variant="contained" onClick={previousHandler}>
            ← Voltar
          </Button>
        )}
        {hasToStart && (
          <Button variant="outlined" color="primary" onClick={toStartHandler}>
            <Typography color='primary'>Voltar ao Início</Typography>
          </Button>
        )}
        <Button variant="contained" color="success" onClick={nextHandler} disabled={nextValidator}>
          {last ? 'Finalizar' : 'Próximo →'}
        </Button>
      </Stack>
    </Box>
  );
}
