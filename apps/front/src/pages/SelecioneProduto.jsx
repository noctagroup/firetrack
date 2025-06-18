import { Box, Container, Grid, Typography, Card, CardContent, CardActionArea } from '@mui/material';
import { useFiretrack } from '../store/FiretrackContext';
import { useEffect, useState } from 'react';
import BaseNavigationButtons from '../components/BaseNavigationButtons';
import { useNavigate } from 'react-router-dom';
import { useLoading } from '../store/LoadingContext';

export default function SelecioneProduto() {
    const [produtos, setProdutos] = useState([]);
    const { fenomenoId, selectedProduct, setSelectedProduct } = useFiretrack();
    const { setLoading, setError } = useLoading();

    const navigate = useNavigate();

    const getProdutos = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("https://api.firetrack.nocta-software-dsm.com/produtos/", {
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": document.cookie.match(/csrftoken=([^;]+)/)?.[1] || ""
                },
                credentials: "include",
            });
            if (!res.ok) {
                throw new Error("Erro ao buscar produtos");
            }
            return await res.json();
        } catch (err) {
            setError(err.message || "Erro desconhecido");
            return [];
        } finally {
            setLoading(false);
        }
    }

    const handleProdutoSelection = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`https://api.firetrack.nocta-software-dsm.com/fenomeno/queimadas/${fenomenoId}/product`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": document.cookie.match(/csrftoken=([^;]+)/)?.[1] || ""
                },
                body: JSON.stringify({ product_id: selectedProduct }),
                credentials: "include",
            });
            if (!res.ok) {
                throw new Error("Erro ao selecionar produto");
            }
            return await res.json();
        } catch (err) {
            setError(err.message || "Erro desconhecido");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getProdutos().then(setProdutos);
    }, []);

    const handleNext = async () => {
        await handleProdutoSelection(fenomenoId, selectedProduct);
        navigate('/selecione-periodo');
    };

    return (
        <Box sx={{ py: 6 }}>
            <Container>
                <Typography variant="h6" color="primary" mb={4}>1. Selecione o produto</Typography>
                <Grid container spacing={4}>
                    {produtos.map((produto) => (
                        <Card
                            key={produto.product_id}
                            variant={selectedProduct === produto.product_id ? 'outlined' : 'elevation'}
                            sx={{
                                borderColor: selectedProduct === produto.product_id ? 'primary.main' : undefined,
                                borderWidth: selectedProduct === produto.product_id ? 2 : 1,
                                borderStyle: selectedProduct === produto.product_id ? 'solid' : 'none',
                            }}
                        >
                            <CardActionArea onClick={() => setSelectedProduct(produto.product_id)}>
                                <CardContent>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        {produto.product_id}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {produto.description}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    ))}
                </Grid>

                <BaseNavigationButtons
                    hasToStart
                    first
                    nextHandler={handleNext}
                    nextValidator={!(selectedProduct != "")}
                />
            </Container>
        </Box>
    );
}
