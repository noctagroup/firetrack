import { Card, CardContent, Typography, Button } from '@mui/material';

export default function ProcessingCard({ title, dataInicio, dataFim, produto, candidatos, estado, acao, onAction }) {
  return (
    <Card sx={{ width: 280, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight="bold">{title}</Typography>
        <Typography fontSize={14}>Data Inicial: {dataInicio}</Typography>
        <Typography fontSize={14}>Data Final: {dataFim}</Typography>
        <Typography fontSize={14}>Produto: {produto}</Typography>
        {candidatos !== undefined && <Typography fontSize={14}>Candidatos: {candidatos}</Typography>}
        {estado && <Typography fontSize={14}>Estado: {estado}</Typography>}
        {acao && (
          <Button onClick={onAction} size="small" variant="text" sx={{ mt: 1, p: 0, textTransform: 'uppercase' }}>{acao}</Button>
        )}
      </CardContent>
    </Card>
  );
}