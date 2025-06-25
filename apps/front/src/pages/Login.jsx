import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthProvider";
import { Box, Button, Container, TextField, Typography, Alert } from "@mui/material";
import { useLoading } from "../store/LoadingContext";

export default function Login() {
  const [query, setQuery] = useState("");
  const [password, setPassword] = useState("");
  const { user, setUser } = useAuth();
  const {setLoading, setError, error} = useLoading();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    setLoading(true);
    e.preventDefault();
    setError("");
    const res = await fetch("http://localhost:8000/conta/entrar/", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, password }),
    });
    if (!res.ok) {
      setError("Usuário ou senha inválidos.");
      setLoading(false);
      return;
    }
    const data = await res.json();
    setUser(data);
    setLoading(false);
    navigate("/processamentos");
  };

  useEffect(()=> {
    if (user) {
      navigate("/processamentos");
    }
  })

  return (
    <Box sx={{ minHeight: "100vh", py: 8 }}>
      <Container maxWidth="xs">
        <Typography variant="h5" mb={4} align="center">Login</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Usuário ou Email"
            fullWidth
            margin="normal"
            value={query}
            onChange={e => setQuery(e.target.value)}
            required
          />
          <TextField
            label="Senha"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
            Entrar
          </Button>
        </form>
      </Container>
    </Box>
  );
}