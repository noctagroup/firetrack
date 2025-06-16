import { ThemeProvider } from '@emotion/react';
import AppRoutes from './routes';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';


export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppRoutes />
    </ThemeProvider>
  )
}
