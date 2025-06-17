import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Checkbox,
    FormControlLabel,
    Modal,
    Button
} from '@mui/material';
import { useFiretrack } from '../store/FiretrackContext';
import BaseNavigationButtons from '../components/BaseNavigationButtons';
import { useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';

const candidatos = {
    "state": "In Visual Analysis",
    "candidates": {
        "180_099": [
            {
                "id": "CBERS_4_AWFI_DRD_20240512_180_099_L2",
                "datetime": "2024-05-12T14:29:00+00:00",
                "thumb": "https://data.inpe.br/bdc/data/cbers4/2024_05/CBERS_4_AWFI_DRD_2024_05_12.14_29_00_CB11/180_099_0/2_BC_UTM_WGS84/CBERS_4_AWFI_20240512_180_099.png",
                "valid": null
            },
            {
                "id": "CBERS_4_AWFI_DRD_20240703_180_099_L2",
                "datetime": "2024-07-03T14:26:30+00:00",
                "thumb": "https://data.inpe.br/bdc/data/cbers4/2024_07/CBERS_4_AWFI_DRD_2024_07_03.14_26_30_CB11/180_099_0/2_BC_UTM_WGS84/CBERS_4_AWFI_20240703_180_099.png",
                "valid": null
            },
            {
                "id": "CBERS_4_AWFI_DRD_20250222_180_099_L2",
                "datetime": "2025-02-22T14:13:30+00:00",
                "thumb": "https://data.inpe.br/bdc/data/cbers4/2025_02/CBERS_4_AWFI_DRD_2025_02_22.14_13_30_CB11/180_099_0/2_BC_UTM_WGS84/CBERS_4_AWFI_20250222_180_099.png",
                "valid": null
            }
        ],
        "180_093": [
            {
                "id": "CBERS_4_AWFI_DRD_20240512_180_093_L2",
                "datetime": "2024-05-12T14:29:00+00:00",
                "thumb": "https://data.inpe.br/bdc/data/cbers4/2024_05/CBERS_4_AWFI_DRD_2024_05_12.14_29_00_CB11/180_093_0/2_BC_UTM_WGS84/CBERS_4_AWFI_20240512_180_093.png",
                "valid": null
            },
            {
                "id": "CBERS_4_AWFI_DRD_20240729_180_093_L2",
                "datetime": "2024-07-29T14:25:30+00:00",
                "thumb": "https://data.inpe.br/bdc/data/cbers4/2024_07/CBERS_4_AWFI_DRD_2024_07_29.14_25_30_CB11/180_093_0/2_BC_UTM_WGS84/CBERS_4_AWFI_20240729_180_093.png",
                "valid": null
            },
            {
                "id": "CBERS_4_AWFI_DRD_20241206_180_093_L2",
                "datetime": "2024-12-06T14:18:30+00:00",
                "thumb": "https://data.inpe.br/bdc/data/cbers4/2024_12/CBERS_4_AWFI_DRD_2024_12_06.14_18_30_CB11/180_093_0/2_BC_UTM_WGS84/CBERS_4_AWFI_20241206_180_093.png",
                "valid": null
            },
            {
                "id": "CBERS_4_AWFI_DRD_20250101_180_093_L2",
                "datetime": "2025-01-01T14:16:30+00:00",
                "thumb": "https://data.inpe.br/bdc/data/cbers4/2025_01/CBERS_4_AWFI_DRD_2025_01_01.14_16_30_CB11/180_093_0/2_BC_UTM_WGS84/CBERS_4_AWFI_20250101_180_093.png",
                "valid": null
            }
        ]
    }
};


export default function AnaliseVisual() {
    const navigate = useNavigate();
    const [selecionadas, setSelecionadas] = useState({});
    const [hoveredImage, setHoveredImage] = useState(null);
    const timerRef = useRef(null);

    const handleToggle = (id) => {
        setSelecionadas((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleNext = () => {
        const selecionadasFinal = Object.keys(selecionadas).filter((id) => selecionadas[id]);
        const validatedCandidates = selecionadasFinal.map((id) => ({ id_img: id, valid: true }));
        
        console.log(JSON.stringify({ validated_candidates: validatedCandidates }, null, 2));
        
        navigate('/processamentos');
    };

    const handleDeselectAll = () => {
        setSelecionadas({});
    };

    const handleMouseEnter = (img) => {
        timerRef.current = setTimeout(() => setHoveredImage(img), 2000);
    };

    const handleMouseLeave = () => {
        clearTimeout(timerRef.current);
        timerRef.current = null;
    };

    return (
        <Box sx={{ py: 6 }}>
            <Container>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                    <Typography variant="h6" color="primary">
                        Análise Visual - Selecione as imagens desejadas
                    </Typography>
                    <Button variant="outlined" color="secondary" onClick={handleDeselectAll}>
                        Desselecionar todas
                    </Button>
                </Box>

                {Object.entries(candidatos.candidates).map(([orbitaPonto, imagens]) => (
                    <Box key={orbitaPonto} mb={4}>
                        <Typography color="black" variant="subtitle1" fontWeight="bold" mb={2}>
                            Órbita/Ponto: {orbitaPonto}
                        </Typography>
                        <Grid container spacing={2}>
                            {imagens.map((img) => (
                                <Grid item xs={12} sm={6} md={4} key={img.id}>
                                    <Card
                                        onMouseEnter={() => handleMouseEnter(img)}
                                        onMouseLeave={handleMouseLeave}
                                    >
                                        <CardMedia
                                            component="img"
                                            height="300"
                                            image={img.thumb}
                                            alt={`Imagem ${img.id}`}
                                        />
                                        <CardContent>
                                            <Typography variant="body2" color="text.secondary">
                                                ID: {img.id}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Data: {new Date(img.datetime).toLocaleString()}
                                            </Typography>
                                        </CardContent>
                                        <CardActions>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={!!selecionadas[img.id]}
                                                        onChange={() => handleToggle(img.id)}
                                                    />
                                                }
                                                label="Selecionar"
                                            />
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                ))}

                <BaseNavigationButtons
                    hasToStart
                    nextHandler={handleNext}
                    last={true}
                    first={true}
                    nextValidator={Object.values(selecionadas).every((v) => !v)}
                />

                <Modal
                    open={!!hoveredImage}
                    onClose={() => setHoveredImage(null)}
                    aria-labelledby="imagem-ampliada"
                    aria-describedby="visualizacao-ampliada"
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            p: 2,
                            outline: 'none'
                        }}
                    >
                        {hoveredImage && (
                            <>
                                <img
                                    src={hoveredImage.thumb}
                                    alt={hoveredImage.id}
                                    style={{ maxWidth: '90vw', maxHeight: '80vh' }}
                                />
                                <Typography mt={2} variant="body2" color="text.secondary">
                                    Data: {new Date(hoveredImage.datetime).toLocaleString()}
                                </Typography>
                            </>
                        )}
                    </Box>
                </Modal>
            </Container>
        </Box>
    );
}
