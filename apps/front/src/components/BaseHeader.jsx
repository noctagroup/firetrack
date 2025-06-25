import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthProvider';

export default function BaseHeader({ children }) {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const match = document.cookie.match(/csrftoken=([^;]+)/);
    const csrfToken = match ? match[1] : null;
    await fetch("http://localhost:8000/conta/sair/", {
      method: "POST",
      credentials: "include",
      headers: { "X-CSRFToken": csrfToken },
    });
    setUser(null);
    navigate("/login");
  };

  return (
    <Box>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Firetrack</Typography>
          {user?.username && (
            <>
              <Typography sx={{ mr: 2 }}>
                {user.full_name || user.username}
              </Typography>
              <Button color="inherit" onClick={handleLogout}>Sair</Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      {children}
    </Box>
  );
}