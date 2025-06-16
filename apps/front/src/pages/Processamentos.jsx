import { Box, Typography, Grid, Button, Stack, Container } from '@mui/material';
import ProcessingCard from '../components/ProcessingCard';
import { useEffect, useState } from 'react';
import { getProcessamentos } from '../services/processamentoService';

export default function Processamentos() {
  const [fenomenos, setFenomenos] = useState([]);
  const [aguardandoAnalise, setAguardandoAnalise] = useState([]);
  const [emProcessamento, setEmProcessamento] = useState([]);

  useEffect(() => {
    getProcessamentos().then(data => {
      setFenomenos(data.fenomenos);
      setAguardandoAnalise(data.aguardandoAnalise);
      setEmProcessamento(data.emProcessamento);
    });
  }, []);

  return (
    <Box sx={{ backgroundColor: '#212121', minHeight: '100vh', minWidth: '100vw', py: 3 }}>
      <Container maxWidth="md">
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h6" color="white">Fenômenos</Typography>
          <Button variant="contained" size="small">+ Começar novo processamento</Button>
        </Stack>
        <Stack spacing={2} mb={6}>
          {fenomenos.map((item) => (
            <ProcessingCard key={item.id} {...item} />
          ))}
        </Stack>

        <Typography variant="h6" gutterBottom color="white">Aguardando Análise Visual</Typography>
        <Stack spacing={2} mb={6}>
          {aguardandoAnalise.map((item) => (
            <ProcessingCard key={item.id} {...item} />
          ))}
        </Stack>

        <Typography variant="h6" gutterBottom color="white">Em Processamento</Typography>
        <Stack spacing={2}>
          {emProcessamento.map((item) => (
            <ProcessingCard key={item.id} {...item} />
          ))}
        </Stack>
      </Container>
    </Box>
  );
}