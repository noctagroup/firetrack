import { Box, Typography, Grid, Button, Stack, Container } from '@mui/material';
import ProcessingCard from '../components/ProcessingCard';
import { useEffect, useState } from 'react';
import { getProcessamentos } from '../services/processamentoService';
import { useNavigate } from 'react-router-dom';
import { useLoading } from '../store/LoadingContext';
import { useFiretrack } from '../store/FiretrackContext';

export default function Processamentos() {
  const [fenomenos, setFenomenos] = useState([]);
  const [aguardandoAnalise, setAguardandoAnalise] = useState([]);
  const [emProcessamento, setEmProcessamento] = useState([]);
  const {fenomenoId, setFenomenoId} = useFiretrack();
  const {setLoading, setError} = useLoading();
  const navigate = useNavigate();

  const handleStartNewProcessing = async () => {
    setLoading(true);
    const res = await fetch("https://api.firetrack.nocta-software-dsm.com/fenomeno/queimadas/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": document.cookie.match(/csrftoken=([^;]+)/)?.[1] || "",
      },
      credentials: "include",
    });

    if (!res.ok) {
      setError(res.body);
      setLoading(false);
      return;
    } else {
      setLoading(false)
      const data = await res.json();
      setFenomenoId(data.id);
      navigate('/selecione-produto');
    }
  };

  useEffect(() => {
    getProcessamentos().then(data => {
      setFenomenos(data.fenomenos);
      setAguardandoAnalise(data.aguardandoAnalise);
      setEmProcessamento(data.emProcessamento);
    });
  }, []);

  return (
    <Box sx={{ py: 3, height: "100%" }}>
      <Container>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h6" color="primary">Fenômenos</Typography>
          <Button variant="contained" size="small" onClick={handleStartNewProcessing}>
            + Começar novo processamento
          </Button>
        </Stack>
        <Stack spacing={2} mb={6}>
          {fenomenos.map((item) => (
            <ProcessingCard key={item.id} {...item} />
          ))}
        </Stack>

        <Typography variant="h6" gutterBottom color="primary">Aguardando Análise Visual</Typography>
        <Stack spacing={2} mb={6}>
          {aguardandoAnalise.map((item) => (
            <ProcessingCard key={item.id} {...item} />
          ))}
        </Stack>

        <Typography variant="h6" gutterBottom color="primary">Em Processamento</Typography>
        <Stack spacing={2}>
          {emProcessamento.map((item) => (
            <ProcessingCard key={item.id} {...item} />
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
