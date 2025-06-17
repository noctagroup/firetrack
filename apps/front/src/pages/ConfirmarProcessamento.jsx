import { Box, Container, Typography, Divider, Stack } from "@mui/material";
import { useFiretrack } from "../store/FiretrackContext";
import BaseNavigationButtons from "../components/BaseNavigationButtons";
import { useNavigate } from "react-router-dom";

export default function ConfirmarProcessamento() {
  const { selectedProduct, fenomenoId, period, aoi, setFenomenoId, setSelectedProduct, setPeriod, setAoi } = useFiretrack();
  const navigate = useNavigate();

  const handleNext = () => {
    console.log("Confirmado:", {
      selectedProduct,
      fenomenoId,
      period,
      aoi,
    });

    setFenomenoId(null);
    setSelectedProduct("");
    setPeriod({ start: '', end: '' });
    setAoi([]);

    navigate("/processamentos");
  };

  const previousHandler = () => {
    navigate("/selecione-aoi")
  }

  return (
    <Box sx={{ py: 6, minHeight: "100vh" }}>
      <Container>
        <Typography variant="h6" color="primary" mb={4}>
          4. Confirme o processamento
        </Typography>

        <Stack spacing={2}>
          <Typography color="black"><strong>Produto Selecionado:</strong> {selectedProduct || "Não selecionado"}</Typography>
          <Typography color="black"><strong>Fenômeno:</strong> {fenomenoId || "Não informado"}</Typography>
          <Typography color="black"><strong>Período:</strong> {period?.start} até {period?.end}</Typography>
          <Typography color="black"><strong>Área de Interesse (BBox):</strong></Typography>
          {aoi?.length === 2 && (
            <Box ml={2}>
              <Typography color="black">SW: {aoi[0][0].toFixed(4)}, {aoi[0][1].toFixed(4)}</Typography>
              <Typography color="black">NE: {aoi[1][0].toFixed(4)}, {aoi[1][1].toFixed(4)}</Typography>
            </Box>
          )}
          <Divider sx={{ my: 2 }} />
        </Stack>

        <BaseNavigationButtons
          hasToStart
          nextHandler={handleNext}
          previousHandler={previousHandler}
          last={true}
          nextValidator={
            !selectedProduct || !period?.start || !period?.end || !aoi || aoi.length !== 2 // || !fenomenoId
          }
        />
      </Container>
    </Box>
  );
}
